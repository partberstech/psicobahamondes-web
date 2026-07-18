import { NextResponse } from 'next/server'
import { eneagramaReportTemplate, type EneagramaTestData } from '@/lib/eneagrama-email'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || 'reservas@psicobahamondes.cl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'psicobahamondes@gmail.com'

export async function POST(request: Request) {
  try {
    const data: EneagramaTestData = await request.json()

    // Validate required fields
    if (!data.nombre || !data.email || !data.tipoPredominante) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: nombre, email, tipoPredominante' },
        { status: 400 }
      )
    }

    if (!RESEND_API_KEY) {
      console.warn('[eneagrama-report] RESEND_API_KEY not set, skipping email')
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: 'Resultado calculado correctamente. Email no configurado.',
      })
    }

    // Generate HTML report
    const html = eneagramaReportTemplate(data)

    // Send email to psychologist
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `Nuevo test de Eneagrama — ${data.nombre}`,
        html,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.error(`[eneagrama-report] Resend error (${resp.status}):`, text)
      return NextResponse.json(
        { error: 'Error al enviar el reporte por email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      message: 'Reporte enviado exitosamente al psicólogo.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    console.error('[eneagrama-report] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
