export type TimeSlot = {
  time: string
  available: boolean
}

export type SessionType = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

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
    slotMinutes: 50,
  },
  'consulta-telematica': {
    label: 'Consulta Telemática',
    days: [1, 2, 3, 4, 5],
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
 * Generate slots purely from config — no DB dependency.
 * Optionally accepts a set of booked times to mark some as taken.
 */
export function getSlotsFromConfig(
  sessionType: SessionType,
  dateStr: string,
  bookedTimes?: Set<string>
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

    if (isToday && current + slotLen <= nowMinutes) {
      current += slotLen
      continue
    }

    slots.push({
      time,
      available: !bookedTimes?.has(time),
    })

    current += slotLen
  }

  return slots
}
