import { NextRequest, NextResponse } from 'next/server'
import { getSlotsFromConfig, getBusyTimesForDate, type SessionType } from '@/lib/availability'
import { queryBookedTimes } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') as SessionType | null
  const date = searchParams.get('date')

  if (!type || !['sesion-cero', 'consulta-presencial', 'consulta-telematica'].includes(type)) {
    return NextResponse.json({ error: 'Invalid or missing type' }, { status: 400 })
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid or missing date (YYYY-MM-DD)' }, { status: 400 })
  }

  // Fetch booked times from DB + busy times from Google Calendar in parallel
  const [dbBooked, googleBusy] = await Promise.all([
    queryBookedTimes(date, type),
    getBusyTimesForDate(date),
  ])

  // Merge both sources of unavailability
  const allBooked = new Set<string>([...Array.from(dbBooked), ...Array.from(googleBusy)])

  const slots = getSlotsFromConfig(type, date, allBooked)
  return NextResponse.json({ slots, type, date })
}
