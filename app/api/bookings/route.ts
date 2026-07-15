import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email'
import { getSlotsFromConfig, SESSION_CONFIG, type SessionType } from '@/lib/availability'
import { getDb, migrate } from '@/lib/db'
import { v4 as uuid } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionType, name, email, phone, date, time } = body

    if (!sessionType || !name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }
    if (!['sesion-cero', 'consulta-presencial', 'consulta-telematica'].includes(sessionType)) {
      return NextResponse.json({ error: 'Tipo de sesión inválido' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const config = SESSION_CONFIG[sessionType as SessionType]
    if (!config) {
      return NextResponse.json({ error: 'Configuración de horario no encontrada' }, { status: 400 })
    }

    // Validate slot time against config
    const validSlots = getSlotsFromConfig(sessionType as SessionType, date)
    const matching = validSlots.find((s) => s.time === time)
    if (!matching) {
      return NextResponse.json({ error: 'Horario no disponible para esta fecha' }, { status: 400 })
    }

    // Try DB save (fails silently — email is the fallback)
    let dbId = uuid()
    let savedToDb = false
    if (process.env.TURSO_DATABASE_URL) {
      try {
        await migrate()
        const db = getDb()
        await db.execute({
          sql: `INSERT INTO bookings (id, session_type, name, email, phone, date, time, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
          args: [dbId, sessionType, name, email, phone, date, time],
        })
        savedToDb = true
      } catch {
        // DB unavailable — booking handled via email
      }
    }

    // Always send emails
    const bookingData = { name, email, phone, sessionType, date, time }
    const emailPromises = Promise.all([
      sendConfirmationEmail(bookingData),
      sendAdminNotification(bookingData),
    ])

    // Create Google Calendar event (fire-and-forget)
    import('@/lib/google-calendar').then(({ createBookingEvent }) =>
      createBookingEvent({
        summary: `${config.label} — ${name}`,
        description: `Consulta agendada desde la web\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nTipo: ${config.label}`,
        date,
        time,
        durationMinutes: config.slotMinutes,
        attendeeEmail: email,
      }).catch((err) => console.error('[booking] calendar event error:', err))
    ).catch(() => { /* Google Calendar not configured */ })

    if (!savedToDb) {
      // No DB — email is the only record; wait for it
      const results = await emailPromises
      if (!results.some(Boolean)) {
        return NextResponse.json({
          error: 'No pudimos procesar tu agendamiento. Escríbenos directamente a contacto@psicobahamondes.cl',
        }, { status: 503 })
      }
      return NextResponse.json({
        success: true,
        id: dbId,
        message: 'Te enviamos la confirmación por correo. Si no lo ves, revisa spam.',
      })
    }

    // Fire-and-forget emails when DB saved
    emailPromises.catch((err) => console.error('[booking] email error:', err))

    return NextResponse.json({
      success: true,
      id: dbId,
      message: 'Consulta agendada exitosamente',
    })
  } catch (err: any) {
    console.error('[booking] error:', err)
    return NextResponse.json({ error: 'Error al agendar. Intenta de nuevo.' }, { status: 500 })
  }
}

export async function GET() {
  if (!process.env.TURSO_DATABASE_URL) {
    return NextResponse.json({ bookings: [], note: 'DB not configured — no persisted bookings' })
  }
  try {
    await migrate()
    const db = getDb()
    const rows = await db.execute(
      'SELECT * FROM bookings ORDER BY date DESC, time DESC LIMIT 100'
    )
    return NextResponse.json({ bookings: rows.rows })
  } catch {
    return NextResponse.json({ bookings: [], note: 'DB unavailable' })
  }
}
