import { getDb, migrate, type Booking, type SessionType } from './db'
export type { SessionType }

export type TimeSlot = {
  time: string
  available: boolean
}

export const SESSION_CONFIG: Record<SessionType, {
  days: number[] // 0=Sun, 1=Mon, ..., 6=Sat
  start: string  // HH:mm
  end: string    // HH:mm
  slotMinutes: number
}> = {
  'sesion-cero': {
    days: [1, 2, 3, 4, 5],        // Lun–Vie
    start: '19:00',
    end: '21:00',
    slotMinutes: 15,
  },
  'consulta-presencial': {
    days: [1, 2, 3, 4, 5, 6],     // Lun–Sáb
    start: '09:00',
    end: '14:00',
    slotMinutes: 50,
  },
  'consulta-telematica': {
    days: [1, 2, 3, 4, 5],        // Lun–Vie
    start: '15:00',
    end: '18:00',
    slotMinutes: 50,
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
 * Generate available time slots for a given date + session type.
 */
export async function getAvailableSlots(
  sessionType: SessionType,
  dateStr: string
): Promise<TimeSlot[]> {
  await migrate()

  const dt = new Date(dateStr + 'T12:00:00')
  const dayOfWeek = dt.getDay()
  const config = SESSION_CONFIG[sessionType]

  // Is the day valid for this session type?
  if (!config.days.includes(dayOfWeek)) return []

  // Is the date in the past?
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const dateObj = new Date(dateStr + 'T00:00:00')
  if (dateObj < today) return []

  // Is it today and already past the end time?
  const now = new Date()
  const isToday = dateStr === now.toISOString().slice(0, 10)

  const startMinutes = parseTime(config.start)
  const endMinutes = parseTime(config.end)
  const slotLen = config.slotMinutes

  // Fetch existing bookings for this date + type
  const db = getDb()
  const existing = await db.execute({
    sql: 'SELECT time FROM bookings WHERE date = ? AND session_type = ? AND status = ?',
    args: [dateStr, sessionType, 'confirmed'],
  })
  const bookedTimes = new Set(existing.rows.map((r: any) => r.time as string))

  // Generate all slots
  const slots: TimeSlot[] = []
  let current = startMinutes

  while (current + slotLen <= endMinutes) {
    const time = formatTime(current)

    // If today, skip past slots
    if (isToday) {
      const slotEnd = current + slotLen
      const nowMinutes = now.getHours() * 60 + now.getMinutes()
      if (slotEnd <= nowMinutes) {
        current += slotLen
        continue
      }
    }

    slots.push({
      time,
      available: !bookedTimes.has(time),
    })

    current += slotLen
  }

  return slots
}
