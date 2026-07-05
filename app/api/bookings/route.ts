import { NextRequest, NextResponse } from 'next/server'
import { getDb, migrate } from '@/lib/db'
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email'
import { getAvailableSlots, type SessionType } from '@/lib/availability'
import { v4 as uuid } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionType, name, email, phone, date, time } = body

    // Validate required fields
    if (!sessionType || !name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }

    // Validate session type
    if (!['sesion-cero', 'consulta-presencial', 'consulta-telematica'].includes(sessionType)) {
      return NextResponse.json({ error: 'Tipo de sesión inválido' }, { status: 400 })
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Check slot is still available
    const slots = await getAvailableSlots(sessionType as SessionType, date)
    const slot = slots.find((s) => s.time === time)
    if (!slot) {
      return NextResponse.json({ error: 'Horario no disponible para esta fecha' }, { status: 400 })
    }
    if (!slot.available) {
      return NextResponse.json({ error: 'Este horario acaba de ser reservado por otra persona' }, { status: 409 })
    }

    // Create booking
    await migrate()
    const db = getDb()
    const id = uuid()

    await db.execute({
      sql: `INSERT INTO bookings (id, session_type, name, email, phone, date, time, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
      args: [id, sessionType, name, email, phone, date, time],
    })

    // Send emails (fire-and-forget, don't block response)
    const bookingData = { name, email, phone, sessionType, date, time }
    Promise.all([
      sendConfirmationEmail(bookingData),
      sendAdminNotification(bookingData),
    ]).catch((err) => console.error('[booking] email error:', err))

    return NextResponse.json({
      success: true,
      id,
      message: 'Consulta agendada exitosamente',
    })
  } catch (err: any) {
    console.error('[booking] error:', err)
    return NextResponse.json({ error: 'Error al agendar. Intenta de nuevo.' }, { status: 500 })
  }
}

export async function GET() {
  await migrate()
  const db = getDb()
  const rows = await db.execute(
    'SELECT * FROM bookings ORDER BY date DESC, time DESC LIMIT 100'
  )
  return NextResponse.json({ bookings: rows.rows })
}
