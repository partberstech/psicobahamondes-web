import { NextResponse } from 'next/server'
import { sendWeeklyNewsletter } from '@/lib/newsletter'

export async function POST() {
  try {
    const result = await sendWeeklyNewsletter()
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Newsletter send error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
