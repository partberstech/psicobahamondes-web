import { NextRequest, NextResponse } from 'next/server'
import { sendReminderEmail } from '@/lib/email'
import { getDb, migrate, type Booking } from '@/lib/db'

function getSantiagoOffset(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00Z`)
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    timeZoneName: 'longOffset',
  }).formatToParts(date)
  const tzPart = parts.find((p) => p.type === 'timeZoneName')
  const match = tzPart?.value?.match(/GMT([+-]\d{2}:\d{2})/)
  return match?.[1] || '-04:00'
}

function bookingDateToUtc(date: string, time: string): Date {
  const offset = getSantiagoOffset(date)
  const sign = offset.startsWith('-') ? -1 : 1
  const [oh, om] = offset.slice(1).split(':').map(Number)
  const offsetMinutes = sign * (oh * 60 + om)
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const utcMillis = Date.UTC(y, m - 1, d, hh, mm) - offsetMinutes * 60_000
  return new Date(utcMillis)
}

export const maxDuration = 60

export async function GET(_request: NextRequest) {
  try {
    if (!process.env.TURSO_DATABASE_URL || !process.env.RESEND_API_KEY) {
      return NextResponse.json({ ok: true, sent: 0, skipped: 0, reason: 'missing env' })
    }

    await migrate()
    const db = getDb()
    const result = await db.execute(`
      SELECT id, session_type, name, email, phone, date, time, status, reminder_sent_at, meet_link
      FROM bookings
      WHERE status = 'confirmed' AND (reminder_sent_at IS NULL OR reminder_sent_at = '')
      ORDER BY date ASC, time ASC
    `)

    const now = new Date()
    const targetMs = 12 * 60 * 60 * 1000
    const windowMs = 20 * 60 * 1000
    const due = result.rows as unknown as Booking[]
    const sentIds: string[] = []

    for (const booking of due) {
      const bookingDate = bookingDateToUtc(booking.date, booking.time)
      const diff = bookingDate.getTime() - now.getTime()
      if (Math.abs(diff - targetMs) > windowMs) continue

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

    return NextResponse.json({ ok: true, sent: sentIds.length, ids: sentIds })
  } catch (err: any) {
    console.error('[reminders] error:', err)
    return NextResponse.json({ ok: false, error: 'Reminder sweep failed' }, { status: 500 })
  }
}
