// ─── Email Templates — Psicobahamondes ───
// Minimalist, Cal.com-style, brand-consistent HTML emails
// Inline styles only — compatible with all major email clients

const BRAND = '#2563eb'
const BRAND_DARK = '#1d4ed8'
const INK = '#111827'
const INK_SOFT = '#374151'
const MUTED = '#6b7280'
const MUTED_LIGHT = '#9ca3af'
const BG = '#ffffff'
const SURFACE = '#f9fafb'
const BORDER = '#e5e7eb'
const SUCCESS = '#059669'

const SITE_URL = 'https://psicobahamondes.cl'

// ─── Session helpers ───

const SESSION_LABELS: Record<string, string> = {
  'sesion-cero': 'Sesión Cero (15 min)',
  'consulta-presencial': 'Consulta Presencial (50 min)',
  'consulta-telematica': 'Consulta Telemática (50 min)',
}

const SESSION_COLORS: Record<string, string> = {
  'sesion-cero': BRAND,
  'consulta-presencial': '#059669',
  'consulta-telematica': '#7c3aed',
}

const SESSION_ICONS: Record<string, string> = {
  'sesion-cero': '☕',
  'consulta-presencial': '📍',
  'consulta-telematica': '💻',
}

const SESSION_MODES: Record<string, string> = {
  'sesion-cero': 'Online',
  'consulta-presencial': 'Presencial · Edificio Plaza Bühler',
  'consulta-telematica': 'Online · Videollamada',
}

export function getSessionLabel(type: string): string {
  return SESSION_LABELS[type] || type
}

// ─── Google Calendar URL ───

function googleCalendarUrl(data: {
  sessionType: string
  date: string
  time: string
  name: string
}): string {
  const label = getSessionLabel(data.sessionType)
  // Parse date and time
  const [y, m, d] = data.date.split('-').map(Number)
  const [hh, mm] = data.time.split(':').map(Number)

  // Default durations per session type (minutes)
  const durations: Record<string, number> = {
    'sesion-cero': 15,
    'consulta-presencial': 50,
    'consulta-telematica': 50,
  }
  const duration = durations[data.sessionType] || 50

  const start = new Date(y, m - 1, d, hh, mm)
  const end = new Date(start.getTime() + duration * 60000)

  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${label} — Psicobahamondes`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Consulta con ${data.name} · ${label}`,
    location: data.sessionType === 'consulta-presencial'
      ? 'Edificio Plaza Bühler, 6to piso, Av. Guillermo Bühler 2005, Santiago'
      : 'Online · Videollamada (el link se envía por separado)',
    sf: 'true',
    output: 'xml',
  })

  return `https://www.google.com/calendar/render?${params.toString()}`
}

// ─── Inline style utilities ───

const table = (attrs = '') => `<table ${attrs} style="width:100%;border-collapse:collapse">`
const td = (content: string, style = '') =>
  `<td style="padding:0;${style}">${content}</td>`
const tr = (cells: string) => `<tr>${cells}</tr>`

// ─── Base wrapper ───

function baseWrapper(
  content: string,
  options?: { preview?: string }
): string {
  const previewText = options?.preview || 'Psicobahamondes · Psicólogo Clínico'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Psicobahamondes</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:'Source Sans 3','Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:1.6;color:${INK};-webkit-font-smoothing:antialiased">
  <!-- Preview text (hidden) -->
  <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">
    ${previewText}
  </div>

  ${table()}
    ${tr(td(`
      <div style="max-width:560px;margin:32px auto">
        ${table('border="0" cellpadding="0" cellspacing="0"')}
          ${tr(td(`
            <!-- ═══ Header ═══ -->
            <div style="background:${BG};border-radius:16px 16px 0 0;overflow:hidden">
              <!-- Brand top bar -->
              <div style="height:4px;background:linear-gradient(90deg,${BRAND},${BRAND_DARK})"></div>
              <div style="padding:32px 36px 0">
                <table style="width:100%">
                  <tr>
                    <td style="padding:0;vertical-align:middle">
                      <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.03em;color:${INK}">
                        Psicobahamondes
                      </span>
                    </td>
                    <td style="padding:0;text-align:right;vertical-align:middle">
                      <span style="font-size:11px;color:${MUTED}">Pedro Bahamondes</span>
                    </td>
                  </tr>
                </table>
                <div style="height:1px;background:${BORDER};margin:20px 0 0"></div>
              </div>
            </div>
          `))}
        </table>

        <!-- ═══ Content ═══ -->
        <div style="background:${BG};padding:0 36px 32px">
          ${content}
        </div>

        <!-- ═══ Footer ═══ -->
        <div style="background:${BG};border-radius:0 0 16px 16px;padding:0 36px 28px">
          <div style="height:1px;background:${BORDER};margin-bottom:20px"></div>
          <table style="width:100%">
            <tr>
              <td style="padding:0;font-size:13px;color:${MUTED};line-height:1.7">
                <strong style="color:${INK_SOFT};font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif">Psicobahamondes</strong><br />
                Pedro Bahamondes · Psicólogo Clínico<br />
                <a href="${SITE_URL}" style="color:${BRAND};text-decoration:none">psicobahamondes.cl</a>
              </td>
              <td style="padding:0;text-align:right;font-size:13px;color:${MUTED};line-height:1.7">
                Edificio Plaza Bühler, 6to piso<br />Av. Guillermo Bühler 2005, Santiago<br />
                <a href="mailto:contacto@psicobahamondes.cl" style="color:${BRAND};text-decoration:none">contacto@psicobahamondes.cl</a>
              </td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:11px;color:${MUTED_LIGHT};text-align:center">
            Este es un correo automático del sistema de agendamiento. Si tienes dudas, responde este mensaje.
          </div>
        </div>
      </div>
    `))}
  </table>
</body>
</html>`
}

// ─── Detail row helper ───

function detailRow(label: string, value: string, color?: string): string {
  return tr(
    td(`<span style="font-size:13px;color:${MUTED}">${label}</span>`, `padding:10px 0;border-bottom:1px solid ${BORDER};width:36%`) +
    td(
      `<span style="font-size:14px;font-weight:600;color:${color || INK}">${value}</span>`,
      `padding:10px 0;border-bottom:1px solid ${BORDER};width:64%`
    )
  )
}

// ─── Confirmación — paciente ───

export function confirmationTemplate(data: {
  name: string
  email: string
  sessionType: string
  date: string
  time: string
}): string {
  const label = getSessionLabel(data.sessionType)
  const color = SESSION_COLORS[data.sessionType] || BRAND
  const icon = SESSION_ICONS[data.sessionType] || '📅'
  const mode = SESSION_MODES[data.sessionType] || ''
  const gcalUrl = googleCalendarUrl({
    sessionType: data.sessionType,
    date: data.date,
    time: data.time,
    name: data.name,
  })

  // Format date nicely
  const dt = new Date(data.date + 'T12:00:00')
  const dateFormatted = dt.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const content = `
    <!-- ═══ Success header ═══ -->
    <div style="text-align:center;padding:24px 0 20px">
      <div style="width:56px;height:56px;border-radius:50%;background:${SUCCESS}10;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${SUCCESS}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.02em;color:${INK};margin:0 0 4px">
        ¡Consulta agendada!
      </h1>
      <p style="font-size:15px;color:${MUTED};margin:0">
        Hola ${data.name}, recibimos tu solicitud correctamente.
      </p>
    </div>

    <!-- ═══ Session type badge ═══ -->
    <div style="background:${color}08;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid ${color}15">
      <table style="width:100%">
        <tr>
          <td style="padding:0;width:40px;vertical-align:middle">
            <span style="font-size:24px">${icon}</span>
          </td>
          <td style="padding:0 0 0 14px;vertical-align:middle">
            <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:${INK}">${label}</span>
            <span style="display:block;font-size:13px;color:${color}">${mode}</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- ═══ Details table ═══ -->
    <table style="width:100%;border-collapse:collapse">
      ${detailRow('Fecha', dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1))}
      ${detailRow('Horario', `${data.time} hrs`)}
      ${detailRow('Email', data.email)}
      ${detailRow('Dirección', mode, color)}
    </table>

    <!-- ═══ Info box ═══ -->
    <div style="background:${SURFACE};border-radius:10px;padding:16px 18px;margin:20px 0;font-size:13px;color:${MUTED};line-height:1.6">
      <strong style="color:${INK_SOFT}">📍 Importante:</strong><br />
      ${data.sessionType === 'consulta-presencial'
        ? 'La dirección exacta de la consulta presencial se confirma vía WhatsApp o email 24 horas antes de tu hora agendada.'
        : data.sessionType === 'sesion-cero'
          ? 'Te contactaré al email registrado minutos antes de la Sesión Cero para coordinar el inicio.'
          : 'El link de videollamada se enviará a tu correo 30 minutos antes de la consulta.'
      }
    </div>

    <!-- ═══ Google Calendar ═══ -->
    <a href="${gcalUrl}" target="_blank" rel="noopener"
      style="display:block;text-align:center;background:${BRAND};color:#ffffff;text-decoration:none;font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;padding:14px 24px;border-radius:12px;margin:20px 0 12px">
      <span style="margin-right:8px">📅</span> Agregar a mi calendario
    </a>

    <p style="font-size:13px;color:${MUTED_LIGHT};text-align:center;margin:0">
      Si necesitas reagendar o cancelar, responde este correo o escríbeme por WhatsApp.
    </p>
  `

  return baseWrapper(content, {
    preview: `Confirmación — ${label} — Psicobahamondes`,
  })
}

// ─── Notificación para administrador ───

export function adminNotificationTemplate(data: {
  name: string
  email: string
  phone: string
  sessionType: string
  date: string
  time: string
}): string {
  const label = getSessionLabel(data.sessionType)
  const icon = SESSION_ICONS[data.sessionType] || '📅'
  const mode = SESSION_MODES[data.sessionType] || ''

  const content = `
    <div style="text-align:center;padding:24px 0 20px">
      <div style="width:56px;height:56px;border-radius:50%;background:${BRAND}10;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <span style="font-size:26px">🔔</span>
      </div>
      <h1 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${INK};margin:0 0 4px">
        Nueva reserva
      </h1>
      <p style="font-size:15px;color:${MUTED};margin:0">
        ${data.name} agendó una consulta
      </p>
    </div>

    <div style="background:${BRAND}08;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid ${BRAND}15">
      <table style="width:100%">
        <tr>
          <td style="padding:0;width:40px;vertical-align:middle">
            <span style="font-size:24px">${icon}</span>
          </td>
          <td style="padding:0 0 0 14px;vertical-align:middle">
            <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:${INK}">${label}</span>
            <span style="display:block;font-size:13px;color:${BRAND}">${mode}</span>
          </td>
        </tr>
      </table>
    </div>

    <table style="width:100%;border-collapse:collapse">
      ${detailRow('Nombre', data.name)}
      ${detailRow('Email', data.email)}
      ${detailRow('Teléfono', data.phone)}
      ${detailRow('Tipo', label)}
      ${detailRow('Fecha', data.date)}
      ${detailRow('Horario', `${data.time} hrs`)}
    </table>
  `

  return baseWrapper(content, {
    preview: `🔔 Nueva reserva: ${data.name} — ${label}`,
  })
}

// ─── Recordatorio para paciente (24h antes) ───

export function reminderTemplate(data: {
  name: string
  sessionType: string
  date: string
  time: string
}): string {
  const label = getSessionLabel(data.sessionType)
  const color = SESSION_COLORS[data.sessionType] || BRAND
  const icon = SESSION_ICONS[data.sessionType] || '📅'
  const mode = SESSION_MODES[data.sessionType] || ''
  const gcalUrl = googleCalendarUrl({
    sessionType: data.sessionType,
    date: data.date,
    time: data.time,
    name: data.name,
  })

  const dt = new Date(data.date + 'T12:00:00')
  const dateFormatted = dt.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const content = `
    <div style="text-align:center;padding:24px 0 20px">
      <div style="width:56px;height:56px;border-radius:50%;background:${BRAND}08;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <span style="font-size:26px">⏰</span>
      </div>
      <h1 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${INK};margin:0 0 4px">
        Tu consulta es mañana
      </h1>
      <p style="font-size:15px;color:${MUTED};margin:0">
        Hola ${data.name}, te recordamos tu horario agendado.
      </p>
    </div>

    <div style="background:${color}08;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid ${color}15">
      <table style="width:100%">
        <tr>
          <td style="padding:0;width:40px;vertical-align:middle">
            <span style="font-size:24px">${icon}</span>
          </td>
          <td style="padding:0 0 0 14px;vertical-align:middle">
            <span style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:600;color:${INK}">${label}</span>
            <span style="display:block;font-size:13px;color:${color}">${mode}</span>
          </td>
        </tr>
      </table>
    </div>

    <table style="width:100%;border-collapse:collapse">
      ${detailRow('Fecha', dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1))}
      ${detailRow('Horario', `${data.time} hrs`)}
      ${detailRow('Dirección', mode, color)}
    </table>

    <div style="background:${SURFACE};border-radius:10px;padding:16px 18px;margin:20px 0;font-size:13px;color:${MUTED};line-height:1.6">
      <strong style="color:${INK_SOFT}">📌 Recordatorio:</strong><br />
      ${data.sessionType === 'consulta-presencial'
        ? 'Confirma tu dirección por WhatsApp si aún no la tienes. Llega 5 minutos antes.'
        : 'Asegúrate de tener una buena conexión a internet. El link de videollamada se enviará 30 minutos antes.'
      }
    </div>

    <a href="${gcalUrl}" target="_blank" rel="noopener"
      style="display:block;text-align:center;background:${BRAND};color:#ffffff;text-decoration:none;font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:600;padding:14px 24px;border-radius:12px;margin:20px 0 12px">
      📅 Ver en Google Calendar
    </a>

    <p style="font-size:13px;color:${MUTED_LIGHT};text-align:center;margin:0">
      Si necesitas reagendar o cancelar, responde este correo.
    </p>
  `

  return baseWrapper(content, {
    preview: `Recordatorio — ${label} — Psicobahamondes`,
  })
}

// ─── Cancelación / error (fallback) ───

export function cancelledTemplate(data: {
  name: string
  sessionType: string
  date: string
  time: string
}): string {
  const label = getSessionLabel(data.sessionType)
  const content = `
    <div style="text-align:center;padding:24px 0 20px">
      <div style="width:56px;height:56px;border-radius:50%;background:#fef2f2;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h1 style="font-family:'Plus Jakarta Sans','Helvetica Neue',Arial,sans-serif;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${INK};margin:0 0 4px">
        Consulta cancelada
      </h1>
      <p style="font-size:15px;color:${MUTED};margin:0">
        Hola ${data.name}, hemos cancelado la siguiente consulta:
      </p>
    </div>

    <table style="width:100%;border-collapse:collapse">
      ${detailRow('Tipo', label)}
      ${detailRow('Fecha', data.date)}
      ${detailRow('Horario', `${data.time} hrs`)}
    </table>

    <p style="font-size:13px;color:${MUTED};text-align:center;margin:20px 0 0">
      Si fue un error o necesitas reagendar, escríbeme a <a href="mailto:contacto@psicobahamondes.cl" style="color:${BRAND};text-decoration:none">contacto@psicobahamondes.cl</a>
    </p>
  `

  return baseWrapper(content, {
    preview: `Cancelación — Psicobahamondes`,
  })
}
