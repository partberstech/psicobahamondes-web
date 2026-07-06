const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || 'reservas@psicobahamondes.cl'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contactopartnerstech@gmail.com'

type BookingData = {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
}

const sessionLabels: Record<string, string> = {
  'sesion-cero': 'Sesión Cero (15 min)',
  'consulta-presencial': 'Consulta Presencial (50 min)',
  'consulta-telematica': 'Consulta Telemática (50 min)',
}

export async function sendConfirmationEmail(data: BookingData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set, skipping email')
    return false
  }

  const label = sessionLabels[data.sessionType] || data.sessionType

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#111827;margin-bottom:8px">¡Agendamiento confirmado!</h2>
      <p style="color:#6b7280;font-size:14px">Hola ${data.name}, aquí están los detalles de tu consulta.</p>
      <table style="width:100%;margin-top:20px;border-collapse:collapse">
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px">Tipo</td><td style="padding:10px 0;font-size:13px;font-weight:600">${label}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Fecha</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.date}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Hora</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.time} hrs</td></tr>
      </table>
      <p style="margin-top:20px;font-size:13px;color:#6b7280">Si necesitas reagendar o cancelar, responde este correo.</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
      <p style="font-size:12px;color:#9ca3af">Psicobahamondes · Pedro Bahamondes · Psicólogo Clínico</p>
    </div>
  `

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [data.email],
        subject: `Confirmación — ${label} — Psicobahamondes`,
        html,
      }),
    })
    const ok = resp.ok
    if (!ok) console.warn('[email] Resend error:', await resp.text())
    return ok
  } catch (err) {
    console.error('[email] failed:', err)
    return false
  }
}

export async function sendAdminNotification(data: BookingData): Promise<boolean> {
  if (!RESEND_API_KEY) return false

  const label = sessionLabels[data.sessionType] || data.sessionType

  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#111827;margin-bottom:8px">Nueva agenda</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px">Nombre</td><td style="padding:10px 0;font-size:13px;font-weight:600">${data.name}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Email</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.email}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Teléfono</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.phone}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Tipo</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${label}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Fecha</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.date}</td></tr>
        <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;border-top:1px solid #e5e7eb">Hora</td><td style="padding:10px 0;font-size:13px;font-weight:600;border-top:1px solid #e5e7eb">${data.time} hrs</td></tr>
      </table>
    </div>
  `

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🔔 Nueva reserva: ${data.name} — ${label}`,
        html,
      }),
    })
    return resp.ok
  } catch {
    return false
  }
}
