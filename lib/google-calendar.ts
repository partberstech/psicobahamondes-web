import { google } from 'googleapis'

export type CalendarEventResult = {
  id: string
  htmlLink: string | null
  meetLink: string | null
}

/**
 * Build the OAuth client from environment credentials.
 * Throws a descriptive error when credentials are missing so callers can
 * distinguish "not configured" from real API failures.
 */
function getAuth() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'Google Calendar no configurado: faltan GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET o GOOGLE_REFRESH_TOKEN'
    )
  }
  const oAuth2 = new google.auth.OAuth2(clientId, clientSecret, 'http://localhost')
  oAuth2.setCredentials({ refresh_token: refreshToken })
  return oAuth2
}

/** "pending" until Google finishes materialising the Meet conference. */
function conferenceIsPending(conferenceData: any): boolean {
  return conferenceData?.createRequest?.status?.statusCode === 'pending'
}

/**
 * Calendar where booking events are created.
 * Set GOOGLE_CALENDAR_ID to a dedicated calendar (e.g. "Agendamiento Web")
 * so bookings never mix with the professional's personal calendar.
 * Defaults to the account's primary calendar.
 */
function bookingCalendarId(): string {
  return process.env.GOOGLE_CALENDAR_ID || 'primary'
}

/**
 * Calendars whose busy times block availability. Always includes the booking
 * calendar; GOOGLE_BUSY_CALENDAR_IDS (comma-separated) can add more, e.g. the
 * personal calendar ("primary") so personal events also block bookings.
 */
function calendarsToCheck(): string[] {
  const ids = new Set<string>()
  ids.add(bookingCalendarId())
  const extra = process.env.GOOGLE_BUSY_CALENDAR_IDS
  if (extra) {
    for (const id of extra.split(',').map((s) => s.trim()).filter(Boolean)) {
      ids.add(id)
    }
  }
  return Array.from(ids)
}

/**
 * Get busy times from the relevant Google Calendar(s) for a date range.
 * Returns an array of { start, end } in ISO format aggregated across the
 * booking calendar and any extra calendars listed in GOOGLE_BUSY_CALENDAR_IDS.
 */
export async function getBusyTimes(start: string, end: string) {
  const cal = google.calendar({ version: 'v3', auth: getAuth() })
  const items = calendarsToCheck().map((id) => ({ id }))
  const res = await cal.freebusy.query({
    requestBody: {
      timeMin: start,
      timeMax: end,
      items,
    },
  })
  const busy: { start: string; end: string }[] = []
  for (const calendarId of Object.keys(res.data.calendars ?? {})) {
    for (const b of res.data.calendars?.[calendarId]?.busy ?? []) {
      busy.push({ start: b.start!, end: b.end! })
    }
  }
  return busy
}

function extractVideoUri(conferenceData: any): string | null {
  const entry = conferenceData?.entryPoints?.find(
    (ep: any) => ep.entryPointType === 'video'
  )
  return entry?.uri ?? null
}

/**
 * Create a Google Calendar event for a booking.
 * For online sessions (sesion-cero, consulta-telematica) it requests a Google
 * Meet conference. Conference creation can finish asynchronously on Google's
 * side, so if the insert returns a "pending" conference we poll events.get a
 * few seconds to capture the real Meet URL before returning.
 */
export async function createBookingEvent(params: {
  summary: string
  description: string
  date: string // YYYY-MM-DD
  time: string // HH:MM
  durationMinutes: number
  attendeeEmail?: string
  sessionType?: string
}): Promise<CalendarEventResult> {
  const { summary, description, date, time, durationMinutes, attendeeEmail, sessionType } = params
  const cal = google.calendar({ version: 'v3', auth: getAuth() })

  const startDateTime = `${date}T${time}:00`
  const [h, m] = time.split(':').map(Number)
  const endMinutes = h * 60 + m + durationMinutes
  const endH = Math.floor(endMinutes / 60)
  const endM = endMinutes % 60
  const endDateTime = `${date}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`

  const isOnline = sessionType === 'sesion-cero' || sessionType === 'consulta-telematica'

  const event: any = {
    summary,
    description,
    start: { dateTime: startDateTime, timeZone: 'America/Santiago' },
    end: { dateTime: endDateTime, timeZone: 'America/Santiago' },
  }

  // Request a Google Meet conference for online sessions
  if (isOnline) {
    event.conferenceData = {
      createRequest: {
        requestId: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' },
      },
    }
  }

  if (attendeeEmail) {
    event.attendees = [{ email: attendeeEmail }]
  }

  // Await the insert completely (no artificial timeout): it must succeed before
  // the booking is confirmed, otherwise the slot would stay un-blocked in the
  // professional's calendar and no Meet link could ever be generated.
  const res = await cal.events.insert({
    calendarId: bookingCalendarId(),
    requestBody: event,
    conferenceDataVersion: isOnline ? 1 : undefined,
    sendUpdates: 'all',
  })

  const eventId = res.data.id!
  const htmlLink = res.data.htmlLink || null
  let meetLink = extractVideoUri(res.data.conferenceData)

  if (isOnline && !meetLink && conferenceIsPending(res.data.conferenceData)) {
    // Poll briefly: Google usually materialises the Meet URL a couple of
    // seconds after the insert when the conference is created asynchronously.
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((r) => setTimeout(r, 1500))
      try {
        const got = await cal.events.get({
          calendarId: bookingCalendarId(),
          eventId,
        })
        meetLink = extractVideoUri(got.data.conferenceData)
        if (meetLink) break
        if (!conferenceIsPending(got.data.conferenceData)) break
      } catch (err: any) {
        console.error('[google-calendar] meet poll error:', err?.message || err)
        break
      }
    }
  }

  return { id: eventId, htmlLink, meetLink }
}

/** Delete a previously created event (used to roll back failed bookings). */
export async function deleteBookingEvent(eventId: string): Promise<boolean> {
  try {
    const cal = google.calendar({ version: 'v3', auth: getAuth() })
    await cal.events.delete({ calendarId: bookingCalendarId(), eventId, sendUpdates: 'none' })
    return true
  } catch (err: any) {
    console.error('[google-calendar] delete error:', err?.message || err)
    return false
  }
}
