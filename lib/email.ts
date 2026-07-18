import {
  confirmationTemplate,
  adminNotificationTemplate,
  reminderTemplate,
  cancelledTemplate,
  getSessionLabel,
} from './email-templates'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.EMAIL_FROM || 'Psicobahamondes <noreply@psicobahamondes.cl>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'psicobahamondes@gmail.com'

export type BookingData = {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
  meetLink?: string
}

type EmailOptions = {
  to: string | string[]
  subject: string
  html: string
}

// ─── Resend API call ───

async function sendResend(options: EmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set, skipping email')
    return false
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text()
      console.warn(`[email] Resend error (${resp.status}):`, text)
    }

    return resp.ok
  } catch (err) {
    console.error('[email] failed:', err)
    return false
  }
}

// ─── Confirmación al paciente ───

export async function sendConfirmationEmail(data: BookingData): Promise<boolean> {
  const label = getSessionLabel(data.sessionType)

  return sendResend({
    to: data.email,
    subject: `Confirmación — ${label} — Psicobahamondes`,
    html: confirmationTemplate(data),
  })
}

// ─── Notificación al administrador ───

export async function sendAdminNotification(data: BookingData): Promise<boolean> {
  if (!RESEND_API_KEY) return false

  const label = getSessionLabel(data.sessionType)

  return sendResend({
    to: ADMIN_EMAIL,
    subject: `🔔 Nueva reserva: ${data.name} — ${label}`,
    html: adminNotificationTemplate(data),
  })
}

// ─── Recordatorio (24h antes) ───

export async function sendReminderEmail(data: BookingData): Promise<boolean> {
  const label = getSessionLabel(data.sessionType)

  return sendResend({
    to: data.email,
    subject: `⏰ Recordatorio: ${label} — Psicobahamondes`,
    html: reminderTemplate(data),
  })
}

// ─── Cancelación ───

export async function sendCancellationEmail(data: BookingData): Promise<boolean> {
  return sendResend({
    to: data.email,
    subject: `Cancelación — Psicobahamondes`,
    html: cancelledTemplate(data),
  })
}

// ─── Notificación de cancelación al admin ───

export async function sendAdminCancellationNotice(data: BookingData): Promise<boolean> {
  if (!RESEND_API_KEY) return false

  const label = getSessionLabel(data.sessionType)

  return sendResend({
    to: ADMIN_EMAIL,
    subject: `❌ Cancelación: ${data.name} — ${label}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
        <h2 style="color:#111827">Cancelación de reserva</h2>
        <p style="color:#6b7280">${data.name} canceló su ${label.toLowerCase()}</p>
        <table style="width:100%;border-collapse:collapse;margin-top:16px">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb">Nombre</td><td style="padding:8px 0;font-size:13px;font-weight:600">${data.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb">Email</td><td style="padding:8px 0;font-size:13px;font-weight:600">${data.email}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb">Teléfono</td><td style="padding:8px 0;font-size:13px;font-weight:600">${data.phone}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb">Tipo</td><td style="padding:8px 0;font-size:13px;font-weight:600">${label}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;border-bottom:1px solid #e5e7eb">Fecha original</td><td style="padding:8px 0;font-size:13px;font-weight:600">${data.date}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Hora</td><td style="padding:8px 0;font-size:13px;font-weight:600">${data.time} hrs</td></tr>
        </table>
      </div>
    `,
  })
}
