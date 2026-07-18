import { NextResponse } from 'next/server'
import { eneagramaReportTemplate, type EneagramaTestData } from '@/lib/eneagrama-email'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_RAW = process.env.EMAIL_FROM || 'reservas@psicobahamondes.cl'
const FROM_EMAIL = `Reservas Psicobahamondes <${FROM_RAW}>`
// Always notify BOTH admin emails
const ADMIN_EMAILS = ['psicobahamondes@gmail.com', 'contactopartnerstech@gmail.com']

export async function POST(request: Request) {
  try {
    const body: EneagramaTestData & { scores: Record<number, number> } = await request.json()

    const data: EneagramaTestData = {
      nombre: body.nombre,
      email: body.email,
      telefono: body.telefono || '',
      scores: body.scores,
      tipoPredominante: body.tipoPredominante,
      ala: body.ala || null,
      centro: body.centro,
      timestamp: body.timestamp || new Date().toISOString(),
    }

    // Generate HTML email report (no PDF — full report is inline)
    const html = eneagramaReportTemplate(data)

    // Send email to psychologist with complete HTML report
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAILS,
        subject: `Nuevo test de Eneagrama — ${data.nombre}`,
        html,
      }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      console.error('[eneagrama/report] Resend error:', resp.status, errText)
      return NextResponse.json({ success: false, error: errText }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[eneagrama/report] Error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
