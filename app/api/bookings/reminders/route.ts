import { NextRequest, NextResponse } from 'next/server'
import { sendReminderEmail } from '@/lib/email'
import { getDb, migrate, type Booking } from '@/lib/db'

/**
 * Fecha de hoy (YYYY-MM-DD) en America/Santiago, calculada a partir de la hora
 * local de Chile para no depender del huso horario del servidor (UTC en Vercel).
 */
function chileToday(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (t: string) => parts.find((p) => p.type === t)?.value || ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/** Suma días a una fecha YYYY-MM-DD sin pasar por zonas horarias locales. */
function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d + days))
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(dt.getUTCDate()).padStart(2, '0')
  return `${dt.getUTCFullYear()}-${mm}-${dd}`
}

export const maxDuration = 60

export async function GET(_request: NextRequest) {
  try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true, sent: 0, skipped: 0, reason: 'missing env' })
    }

    await migrate()
    const db = getDb()
    // Recordatorio "día previo" (~24h antes): solo Sesión Cero y Telemática,
    // que son las modalidades que se agendan en la web y tienen link de Meet.
    // La presencial se agenda vía Osornosalud, fuera de este sistema.
    const tomorrow = addDays(chileToday(), 1)
    const result = await db.execute({
      sql: `SELECT id, session_type, name, email, phone, date, time, status, reminder_sent_at, meet_link
            FROM bookings
            WHERE status = 'confirmed'
              AND session_type IN ('sesion-cero', 'consulta-telematica')
              AND date = ?
              AND (reminder_sent_at IS NULL OR reminder_sent_at = '')
            ORDER BY time ASC`,
      args: [tomorrow],
    })

    const due = result.rows as unknown as Booking[]
    const sentIds: string[] = []

    for (const booking of due) {
      const ok = await sendReminderEmail({
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        sessionType: booking.session_type,
        date: booking.date,
        time: booking.time,
        ...(booking.meet_link ? { meetLink: booking.meet_link } : {}),
      })

      if (ok) {
        await db.execute({
          sql: `UPDATE bookings SET reminder_sent_at = datetime('now') WHERE id = ?`,
          args: [booking.id],
        })
        sentIds.push(booking.id)
      }
    }

    return NextResponse.json({ ok: true, sent: sentIds.length, date: tomorrow, ids: sentIds })
  } catch (err: any) {
    console.error('[reminders] error:', err)
    return NextResponse.json({ ok: false, error: 'Reminder sweep failed' }, { status: 500 })
  }
}
