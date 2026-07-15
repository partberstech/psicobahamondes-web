import { google } from 'googleapis'

const oAuth2 = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost'
)
oAuth2.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

export const calendar = google.calendar({ version: 'v3', auth: oAuth2 })
export const gmail = google.gmail({ version: 'v1', auth: oAuth2 })

/**
 * Get busy times from the psychologist's Google Calendar for a date range.
 * Returns array of { start, end } in ISO format.
 */
export async function getBusyTimes(start: string, end: string) {
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      items: [{ id: 'primary' }],
    },
  })
  const busy = res.data.calendars?.primary?.busy ?? []
  return busy.map((b) => ({
    start: b.start!,
    end: b.end!,
  }))
}

/**
 * Create a Google Calendar event for a booking.
 */
export async function createBookingEvent(params: {
  summary: string
  description: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  durationMinutes: number
  attendeeEmail?: string
}) {
  const { summary, description, date, time, durationMinutes, attendeeEmail } = params

  const startDateTime = `${date}T${time}:00`
  const [h, m] = time.split(':').map(Number)
  const endMinutes = h * 60 + m + durationMinutes
  const endH = Math.floor(endMinutes / 60)
  const endM = endMinutes % 60
  const endDateTime = `${date}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`

  const event: any = {
    summary,
    description,
    start: { dateTime: startDateTime, timeZone: 'America/Santiago' },
    end: { dateTime: endDateTime, timeZone: 'America/Santiago' },
  }

  if (attendeeEmail) {
    event.attendees = [{ email: attendeeEmail }]
  }

  const res = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  })

  return { id: res.data.id, htmlLink: res.data.htmlLink }
}
