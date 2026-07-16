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

    // Create Google Calendar event + get Meet link (fire-and-forget, don't block emails)
    let meetLink: string | null = null
    try {
      const { createBookingEvent } = await import('@/lib/google-calendar')
      const calPromise = createBookingEvent({
        summary: `${config.label} — ${name}`,
        description: `Consulta agendada desde la web\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nTipo: ${config.label}`,
        date,
        time,
        durationMinutes: config.slotMinutes,
        attendeeEmail: email,
        sessionType,
      })
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Calendar timeout')), 8000)
      )
      // Race but don't block — catch silently
      Promise.race([calPromise, timeoutPromise])
        .then((result) => {
          meetLink = result.meetLink || null
          // If we got a Meet link, send a follow-up email with it
          if (meetLink) {
            const withLink = { name, email, phone, sessionType, date, time, meetLink }
            Promise.all([
              sendConfirmationEmail(withLink),
              sendAdminNotification(withLink),
            ]).catch(() => {})
          }
        })
        .catch((err) => console.error('[booking] calendar/meet error:', err?.message || err))
    } catch (err) {
      console.error('[booking] calendar import error:', err)
    }

    // Send confirmation emails FIRST (must complete before response)
    const bookingData = { name, email, phone, sessionType, date, time }

    if (!savedToDb) {
      // No DB — email is the only record; must wait
      const results = await Promise.all([
        sendConfirmationEmail(bookingData),
        sendAdminNotification(bookingData),
      ])
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

    // DB saved — await emails before responding
    await Promise.all([
      sendConfirmationEmail(bookingData),
      sendAdminNotification(bookingData),
    ])

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
