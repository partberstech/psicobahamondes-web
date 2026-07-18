import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAdminNotification, sendEneagramaReport } from '@/lib/email'
import { getSlotsFromConfig, getBusyTimesForDate, SESSION_CONFIG, type SessionType, type BusyRange } from '@/lib/availability'
import { getDb, migrate, queryBookedTimes, saveContact } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { eneagramaReportTemplate } from '@/lib/eneagrama-email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionType, name, email, phone, date, time, eneagramaData } = body

    if (!sessionType || !name || !email || !phone || !date || !time) {
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
    }
    if (!['sesion-cero', 'consulta-presencial', 'consulta-telematica'].includes(sessionType)) {
      return NextResponse.json({ error: 'Tipo de sesión inválido' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }
    if (!/^(\+?56)?9\d{8}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ error: 'Teléfono inválido — debe ser un número chileno (+569XXXXXXXX)' }, { status: 400 })
    }

    const config = SESSION_CONFIG[sessionType as SessionType]
    if (!config) {
      return NextResponse.json({ error: 'Configuración de horario no encontrada' }, { status: 400 })
    }

    // ── Validate slot against DB bookings + Google Calendar ──
    const [bookedFromDb, busyRanges] = await Promise.all([
      queryBookedTimes(date, sessionType as SessionType),
      getBusyTimesForDate(date),
    ])
    const validSlots = getSlotsFromConfig(sessionType as SessionType, date, bookedFromDb, busyRanges)
    const matching = validSlots.find((s) => s.time === time)
    if (!matching) {
      return NextResponse.json({ error: 'Horario no disponible para esta fecha' }, { status: 400 })
    }
    if (!matching.available) {
      return NextResponse.json({ error: 'Este horario ya está reservado. Por favor elige otro.' }, { status: 409 })
    }

    // ── Save to DB ──
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

        await saveContact({
          name, email, phone, source: sessionType, bookingId: dbId,
        })
      } catch {
        // DB unavailable — booking handled via email
      }
    }

    // ── Create Google Calendar event (blocking with 8s timeout to capture Meet link) ──
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
      const result = await Promise.race([calPromise, timeoutPromise])
      meetLink = result.meetLink || null
    } catch (err: any) {
      console.error('[booking] calendar/meet error:', err?.message || err)
      // Continue — emails still sent without Meet link
    }

    // ── Send confirmation emails (ONE delivery with meetLink if available) ──
    const bookingData = { name, email, phone, sessionType, date, time, ...(meetLink ? { meetLink } : {}) }

    if (!savedToDb) {
      const results = await Promise.all([
        sendConfirmationEmail(bookingData),
        sendAdminNotification(bookingData),
      ])
      if (!results.some(Boolean)) {
        return NextResponse.json({
          error: 'No pudimos procesar tu agendamiento. Escríbenos directamente a contacto@psicobahamondes.cl',
        }, { status: 503 })
      }
    } else {
      await Promise.all([
        sendConfirmationEmail(bookingData),
        sendAdminNotification(bookingData),
      ])
    }

    // ── If eneagrama test data is present, send HTML report (no PDF) ──
    let reportSent = false
    if (eneagramaData && sessionType === 'sesion-cero') {
      try {
        const html = eneagramaReportTemplate(eneagramaData)
        reportSent = await sendEneagramaReport(
          ['psicobahamondes@gmail.com', 'contactopartnerstech@gmail.com'],
          { nombre: eneagramaData.nombre, email: eneagramaData.email, sessionType },
          html,
        )
        if (!reportSent) {
          console.error('[booking] report send failed (Resend returned non-ok)')
        }
      } catch (err) {
        console.error('[booking] report send error:', err)
        reportSent = false
      }
    }

    return NextResponse.json({
      success: true,
      id: dbId,
      reportSent,
      message: savedToDb
        ? 'Consulta agendada exitosamente'
        : 'Te enviamos la confirmación por correo. Si no lo ves, revisa spam.',
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
