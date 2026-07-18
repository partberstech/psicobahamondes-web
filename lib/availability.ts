export type TimeSlot = {
  time: string
  available: boolean
}

export type SessionType = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

/** A busy period in minutes from midnight (America/Santiago local time) */
export type BusyRange = {
  start: number
  end: number
}

export const SESSION_CONFIG: Record<SessionType, {
  label: string
  days: number[]
  start: string
  end: string
  slotMinutes: number
}> = {
  'sesion-cero': {
    label: 'Sesión Cero',
    days: [1, 2, 3, 4, 5],
    start: '19:00',
    end: '21:00',
    slotMinutes: 15,
  },
  'consulta-presencial': {
    label: 'Consulta Presencial',
    days: [1, 2, 3, 4, 5, 6],
    start: '09:00',
    end: '14:00',
    slotMinutes: 45,
  },
  'consulta-telematica': {
    label: 'Consulta Telemática',
    days: [1, 2, 3, 4, 5],
    start: '15:00',
    end: '18:00',
    slotMinutes: 45,
  },
}

function parseTime(s: string): number {
  const [h, m] = s.split(':').map(Number)
  return h * 60 + m
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Get the UTC offset string for America/Santiago on a given date.
 * Returns e.g. "-03:00" (DST) or "-04:00" (standard).
 */
function getSantiagoOffset(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00Z')
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Santiago',
    timeZoneName: 'longOffset',
  }).formatToParts(date)
  const tzPart = parts.find(p => p.type === 'timeZoneName')
  if (tzPart?.value) {
    const match = tzPart.value.match(/GMT([+-]\d{2}:\d{2})/)
    if (match) return match[1]
  }
  return '-04:00' // fallback seguro
}

/**
 * Convert an ISO timestamp to minutes-from-midnight in America/Santiago.
 */
function toSantiagoMinutes(isoString: string): number {
  const date = new Date(isoString)
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const h = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10)
  const m = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10)
  return h * 60 + m
}

/**
 * Check if a slot [slotStart, slotEnd] overlaps any busy range.
 */
function hasSlotOverlap(slotStart: number, slotEnd: number, busyRanges: BusyRange[]): boolean {
  return busyRanges.some(b => slotStart < b.end && slotEnd > b.start)
}

/**
 * Generate slots purely from config.
 *
 * @param bookedTimes  Exact "HH:MM" start times already booked in the DB.
 * @param busyRanges   Time ranges (in Santiago minutes) from Google Calendar that overlap.
 */
export function getSlotsFromConfig(
  sessionType: SessionType,
  dateStr: string,
  bookedTimes?: Set<string>,
  busyRanges?: BusyRange[],
): TimeSlot[] {
  const dt = new Date(dateStr + 'T12:00:00')
  const dayOfWeek = dt.getDay()
  const config = SESSION_CONFIG[sessionType]

  if (!config.days.includes(dayOfWeek)) return []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateObj = new Date(dateStr + 'T00:00:00')
  if (dateObj < today) return []

  const now = new Date()
  const isToday = dateStr === now.toISOString().slice(0, 10)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const startMinutes = parseTime(config.start)
  const endMinutes = parseTime(config.end)
  const slotLen = config.slotMinutes

  const slots: TimeSlot[] = []
  let current = startMinutes

  while (current + slotLen <= endMinutes) {
    const time = formatTime(current)
    const slotEnd = current + slotLen

    if (isToday && slotEnd <= nowMinutes) {
      current += slotLen
      continue
    }

    // Check both sources of unavailability
    const exactBusy = bookedTimes?.has(time) ?? false        // DB-match on exact HH:MM start
    const rangeBusy = busyRanges ? hasSlotOverlap(current, slotEnd, busyRanges) : false  // Calendar overlap

    slots.push({ time, available: !exactBusy && !rangeBusy })
    current += slotLen
  }

  return slots
}

/**
 * Fetch busy times from Google Calendar for a specific date
 * and return as BusyRange[] (minutes from midnight in America/Santiago).
 */
export async function getBusyTimesForDate(dateStr: string): Promise<BusyRange[]> {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
    return [] // No Google configured — all slots available
  }

  try {
    const { getBusyTimes } = await import('./google-calendar')
    const offset = getSantiagoOffset(dateStr)
    const dayStart = `${dateStr}T00:00:00${offset}`
    const dayEnd = `${dateStr}T23:59:59${offset}`
    const busy = await getBusyTimes(dayStart, dayEnd)

    return busy.map(b => ({
      start: toSantiagoMinutes(b.start),
      end: toSantiagoMinutes(b.end),
    }))
  } catch {
    return [] // Fallback — don't block slots on API error
  }
}
