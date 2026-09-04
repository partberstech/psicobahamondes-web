import { NextRequest, NextResponse } from 'next/server'
import { sendConfirmationEmail, sendAdminNotification, sendEneagramaReport, type BookingData } from '@/lib/email'
import { getSlotsFromConfig, getBusyTimesForDate, SESSION_CONFIG, type SessionType } from '@/lib/availability'
import { getDb, migrate, queryBookedTimes, saveContact } from '@/lib/db'
import { v4 as uuid } from 'uuid'
import { eneagramaReportTemplate } from '@/lib/eneagrama-email'

// Google Meet conferences + calendar inserts can take >10s on the first call.
export const maxDuration = 60

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
    const [bookedFromDb, busyCheck] = await Promise.all([
      queryBookedTimes(date, sessionType as SessionType),
      getBusyTimesForDate(date),
    ])
    if (!busyCheck.ok) {
      console.warn('[booking] proceeding without Google Calendar verification for', date)
    }
    const validSlots = getSlotsFromConfig(sessionType as SessionType, date, bookedFromDb, busyCheck.busy)
    const matching = validSlots.find((s) => s.time === time)
    if (!matching) {
      return NextResponse.json({ error: 'Horario no disponible para esta fecha' }, { status: 400 })
    }
    if (!matching.available) {
      return NextResponse.json({ error: 'Este horario ya está reservado. Por favor elige otro.' }, { status: 409 })
    }

    // ── 1) Reserve the slot in the DB (status confirmed) ──
    const dbId = uuid()
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
      } catch (err: any) {
        const msg: string = err?.message || ''
        if (msg.includes('UNIQUE constraint failed')) {
          // Concurrent booking grabbed the same slot between validation and insert
          return NextResponse.json(
            { error: 'Este horario ya está reservado. Por favor elige otro.' },
            { status: 409 }
          )
        }
        console.error('[booking] db insert error:', err)
        return NextResponse.json(
          { error: 'No pudimos guardar tu reserva. Intenta de nuevo en unos minutos.' },
          { status: 503 }
        )
      }
    }

    // ── 2) Create the Google Calendar event (required, fail-closed) ──
    // No artificial timeout: if the event cannot be created the booking must
    // NOT be confirmed (the slot would stay un-blocked and no Meet link would
    // exist for online sessions).
    let calResult: { id: string; htmlLink: string | null; meetLink: string | null } | null = null
    try {
      const { createBookingEvent } = await import('@/lib/google-calendar')
      calResult = await createBookingEvent({
        summary: `${config.label} — ${name}`,
        description: `Consulta agendada desde la web\n\nNombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nTipo: ${config.label}`,
        date,
        time,
        durationMinutes: config.slotMinutes,
        attendeeEmail: email,
        sessionType,
      })
    } catch (err: any) {
      console.error('[booking] calendar event error:', err?.message || err)
      // Roll back the DB reservation so the slot is freed
      if (savedToDb) {
        try {
          const db = getDb()
          await db.execute({
            sql: `UPDATE bookings SET status = 'cancelled' WHERE id = ?`,
            args: [dbId],
          })
        } catch (rollbackErr) {
          console.error('[booking] db rollback error:', rollbackErr)
        }
      }
      return NextResponse.json(
        {
          error:
            'No pudimos bloquear el horario en la agenda del profesional, por lo que tu reserva NO quedó confirmada. ' +
            'Por favor reintenta o escríbenos a contacto@psicobahamondes.cl para agendar directamente.',
        },
        { status: 503 }
      )
    }

    const meetLink = calResult.meetLink || null
    const eventLink = calResult.htmlLink || null

    // ── 3) Persist event id + Meet link on the booking (best-effort) ──
    if (savedToDb && calResult.id) {
      try {
        const db = getDb()
        await db.execute({
          sql: `UPDATE bookings SET event_id = ?, meet_link = ? WHERE id = ?`,
          args: [calResult.id, meetLink, dbId],
        })
      } catch (err) {
        console.error('[booking] persist event error:', err)
      }
    }

    // ── 4) Send confirmation emails (ONE delivery with Meet link if available) ──
    const bookingData: BookingData = {
      name,
      email,
      phone,
      sessionType,
      date,
      time,
      ...(meetLink ? { meetLink } : {}),
      ...(eventLink ? { eventLink } : {}),
    }

    const results = await Promise.all([
      sendConfirmationEmail(bookingData),
      sendAdminNotification(bookingData),
    ])

    if (!savedToDb && !results.some(Boolean)) {
      // No DB record and no emails delivered — remove the calendar event to
      // avoid leaving a ghost reservation with no trace anywhere.
      if (calResult?.id) {
        try {
          const { deleteBookingEvent } = await import('@/lib/google-calendar')
          await deleteBookingEvent(calResult.id)
        } catch (err) {
          console.error('[booking] rollback event delete error:', err)
        }
      }
      return NextResponse.json({
        error: 'No pudimos procesar tu agendamiento. Escríbenos directamente a contacto@psicobahamondes.cl',
      }, { status: 503 })
    }
    if (!results.some(Boolean)) {
      // DB saved, so the booking is real — but warn loudly (admin relies on this email)
      console.error('[booking] emails failed after successful booking', { dbId, calResult: calResult?.id })
    }

    // ── 5) Eneagrama report delivery ──
    // The psychologist ALWAYS receives the report when the test is completed on
    // the page (/api/eneagrama/report). Here, when a booking carries test data:
    //   • the USER receives their report by email (booking = the hook to deliver
    //     the results and review them in a Sesión Cero / session);
    //   • the psychologist is included again ONLY if the original send failed
    //     (client reported reportSent !== true), so the report is never lost.
    let reportSent = false
    const hasReport = !!(eneagramaData && eneagramaData.scores && eneagramaData.tipoPredominante)
    if (hasReport) {
      try {
        const html = eneagramaReportTemplate(eneagramaData)
        const to: string[] = [email]
        if (eneagramaData.reportSent !== true) {
          to.push('psicobahamondes@gmail.com', 'contactopartnerstech@gmail.com')
        }
        reportSent = await sendEneagramaReport(
          to,
          { nombre: eneagramaData.nombre, email: eneagramaData.email, sessionType },
          html,
          { subject: `📋 Tu reporte de Eneagrama — ${eneagramaData.nombre || name}` },
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
      eventCreated: true,
      meetLink,
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
