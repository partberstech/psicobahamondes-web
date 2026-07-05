import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots, type SessionType } from '@/lib/availability'

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

  const slots = await getAvailableSlots(type, date)
  return NextResponse.json({ slots, type, date })
}
