import crypto from 'node:crypto'

const NOTION_KEY = process.env.NOTION_API_KEY || ''
const NOTION_VERSION = '2022-06-28'
const BLOG_DB = '397bedc4-2b9f-813f-9136-f598ec9f5cc2'
const SUBSCRIBERS_DB = '397bedc4-2b9f-8103-8654-d3c5cd056bf3'

const RESEND_KEY = process.env.RESEND_API_KEY || ''
/** Remitente: prioriza un buzón dedicado; si no existe, usa el ya verificado. */
const FROM = process.env.NEWSLETTER_FROM || process.env.EMAIL_FROM || 'newsletter@psicobahamondes.cl'
const REPLY_TO = process.env.ADMIN_EMAIL || undefined
const SITE = 'https://www.psicobahamondes.cl'

/** Clave para firmar los enlaces de baja y autenticar el envío. */
/**
 * Clave para firmar los enlaces de baja. Deliberadamente NO usa CRON_SECRET:
 * ese valor puede añadirse o rotarse y dejaría inválidos los enlaces ya
 * enviados por correo. NEWSLETTER_SECRET (opcional) permite separarla; si no
 * existe se usa NOTION_API_KEY, que es estable en todos los entornos.
 */
const SIGNING_SECRET = process.env.NEWSLETTER_SECRET || process.env.NOTION_API_KEY || ''

export type NewsletterPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  cover: string | null
}

export type Subscriber = {
  id: string
  email: string
  name: string
}

// ─────────────────────────────────────────────────────────────
// Utilidades
// ─────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function notionFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!resp.ok) {
    console.error('[newsletter:notion]', path, resp.status, (await resp.text()).slice(0, 300))
    return null
  }
  return resp.json()
}

function text(prop: any): string {
  if (!prop) return ''
  const arr = prop.title || prop.rich_text || []
  return arr.map((t: any) => t.plain_text).join('')
}

function fileUrl(obj: any): string {
  if (!obj) return ''
  if (obj.type === 'external') return obj.external?.url || ''
  if (obj.type === 'file') return obj.file?.url || ''
  return obj.url || ''
}

// ─────────────────────────────────────────────────────────────
// Baja (unsubscribe) firmada
// ─────────────────────────────────────────────────────────────

function b64url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function unb64url(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4))
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64').toString('utf8')
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', SIGNING_SECRET).update(payload).digest('base64url')
}

/** Comparación en tiempo constante sobre strings. */
function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** Token opaco que identifica al suscriptor sin exponer su correo en la URL. */
export function unsubscribeToken(email: string): string {
  const payload = b64url(email.toLowerCase().trim())
  return `${payload}.${sign(payload)}`
}

export function emailFromToken(token: string): string | null {
  const [payload, sig] = (token || '').split('.')
  if (!payload || !sig) return null
  const expected = sign(payload)
  if (!safeEqual(sig, expected)) return null
  try {
    const email = unb64url(payload)
    return email.includes('@') ? email : null
  } catch {
    return null
  }
}

export function unsubscribeUrl(email: string): string {
  return `${SITE}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken(email))}`
}

// ─────────────────────────────────────────────────────────────
// Lectura de Notion
// ─────────────────────────────────────────────────────────────

/** Artículos publicados en los últimos `days` días, más recientes primero. */
export async function getRecentPosts(days = 7): Promise<NewsletterPost[]> {
  const since = new Date()
  since.setDate(since.getDate() - days)
  const dateStr = since.toISOString().split('T')[0]

  const data: any = await notionFetch(`/databases/${BLOG_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: { property: 'Fecha', date: { on_or_after: dateStr } },
      sorts: [{ property: 'Fecha', direction: 'descending' }],
      page_size: 50,
    }),
  })
  if (!data?.results) return []

  return data.results
    .map((page: any) => {
      const p = page.properties || {}
      return {
        id: page.id,
        title: text(p['Título']),
        slug: text(p.Slug),
        excerpt: text(p.Extracto),
        category: p['Categoría']?.select?.name || '',
        cover: fileUrl(page.cover) || null,
        published: Boolean(p['Publicado']?.checkbox),
      }
    })
    .filter((p: any) => p.published && p.title && p.slug)
    .map(({ published, ...rest }: any) => rest)
}

/** Todos los suscriptores con estado distinto de "Inactivo". */
export async function getActiveSubscribers(): Promise<Subscriber[]> {
  const data: any = await notionFetch(`/databases/${SUBSCRIBERS_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({ page_size: 100 }),
  })
  if (!data?.results) return []

  const out: Subscriber[] = []
  for (const page of data.results) {
    const p = page.properties || {}
    const email = text(p.Email).trim().toLowerCase()
    const estado = p.Estado?.select?.name || ''
    if (!email.includes('@')) continue
    if (estado === 'Inactivo') continue
    out.push({ id: page.id, email, name: text(p.Nombre).trim() })
  }
  return out
}

/** Marca a un suscriptor como Inactivo. Devuelve true si se aplicó. */
export async function unsubscribeEmail(email: string): Promise<boolean> {
  const data: any = await notionFetch(`/databases/${SUBSCRIBERS_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: { property: 'Email', title: { equals: email.toLowerCase().trim() } },
      page_size: 5,
    }),
  })
  const page = data?.results?.[0]
  if (!page) return false

  const resp = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ properties: { Estado: { select: { name: 'Inactivo' } } } }),
  })
  return resp.ok
}

// ─────────────────────────────────────────────────────────────
// Plantilla del correo
// ─────────────────────────────────────────────────────────────

function postCard(post: NewsletterPost, index: number): string {
  const url = `${SITE}/blog/${post.slug}`
  const title = escapeHtml(post.title)
  const excerpt = escapeHtml(post.excerpt)
  const category = escapeHtml(post.category)
  const cover = post.cover ? escapeHtml(post.cover) : ''

  return `
  <tr>
    <td style="padding:0 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:${index === 0 ? '8px' : '26px'} 0 ${index === 0 ? '26px' : '0'};border-bottom:1px solid #eef2f7;">
            ${
              cover
                ? `<a href="${url}" style="text-decoration:none;"><img src="${cover}" width="536" alt="" style="display:block;width:100%;max-width:536px;height:auto;border-radius:14px;border:1px solid #eef2f7;margin-bottom:16px;" /></a>`
                : ''
            }
            ${
              category
                ? `<p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;color:#2563eb;">${category}</p>`
                : ''
            }
            <h2 style="margin:0 0 8px;font-family:Helvetica,Arial,sans-serif;font-size:20px;line-height:1.3;font-weight:700;color:#111827;">
              <a href="${url}" style="color:#111827;text-decoration:none;">${title}</a>
            </h2>
            ${excerpt ? `<p style="margin:0 0 14px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6b7280;">${excerpt}</p>` : ''}
            <a href="${url}" style="display:inline-block;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#2563eb;text-decoration:none;">
              Leer artículo &rarr;
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

export function buildNewsletterHTML(
  posts: NewsletterPost[],
  opts: { unsubscribeUrl?: string; previewText?: string } = {}
): string {
  const count = posts.length
  const noun = count === 1 ? 'artículo nuevo' : `${count} artículos nuevos`
  const preheader = opts.previewText || `Esta semana en Psicobahamondes: ${noun}.`

  const cards = posts.map((p, i) => postCard(p, i)).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Psicobahamondes — Newsletter</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-collapse:collapse;">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;border-collapse:collapse;box-shadow:0 2px 12px rgba(0,0,0,0.04);">

        <!-- Cabecera -->
        <tr>
          <td style="background:#111827;padding:26px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;">
                  Psicobahamondes
                </td>
                <td align="right" style="font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#93c5fd;font-weight:700;">
                  Newsletter
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:32px 32px 18px;">
            <p style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;color:#2563eb;">
              Lo nuevo del blog
            </p>
            <h1 style="margin:0 0 10px;font-family:Helvetica,Arial,sans-serif;font-size:26px;line-height:1.2;font-weight:800;color:#111827;letter-spacing:-0.02em;">
              Esta semana publicamos ${noun}
            </h1>
            <p style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#6b7280;">
              Contenido sobre neuropsicología, Eneagrama y constelaciones familiares, pensado para acompañar tu proceso.
            </p>
          </td>
        </tr>

        ${cards}

        <!-- CTA -->
        <tr>
          <td style="padding:30px 32px 8px;" align="center">
            <a href="${SITE}/blog" style="display:inline-block;padding:13px 26px;background:#111827;color:#ffffff;border-radius:999px;font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;text-decoration:none;">
              Ver todos los artículos
            </a>
          </td>
        </tr>

        <!-- Pie -->
        <tr>
          <td style="padding:24px 32px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #eef2f7;">
              <tr>
                <td style="padding-top:20px;font-family:Helvetica,Arial,sans-serif;font-size:11px;line-height:1.7;color:#9ca3af;text-align:center;">
                  Recibes este correo porque te suscribiste al newsletter de Psicobahamondes.<br />
                  <a href="${SITE}" style="color:#6b7280;text-decoration:underline;">psicobahamondes.cl</a>
                  ${
                    opts.unsubscribeUrl
                      ? ` &nbsp;·&nbsp; <a href="${escapeHtml(opts.unsubscribeUrl)}" style="color:#6b7280;text-decoration:underline;">Darme de baja</a>`
                      : ''
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

// ─────────────────────────────────────────────────────────────
// Envío
// ─────────────────────────────────────────────────────────────

type OutgoingEmail = {
  from: string
  to: string[]
  subject: string
  html: string
  reply_to?: string
}

/** Envía por la API batch de Resend: cada correo va a UN destinatario. */
async function sendBatch(messages: OutgoingEmail[]): Promise<{ sent: number; failed: number; errors: string[] }> {
  if (!RESEND_KEY) return { sent: 0, failed: messages.length, errors: ['Falta RESEND_API_KEY'] }

  let sent = 0
  let failed = 0
  const errors: string[] = []

  for (let i = 0; i < messages.length; i += 100) {
    const chunk = messages.slice(i, i + 100)
    const resp = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    })
    if (resp.ok) {
      sent += chunk.length
    } else {
      const detail = (await resp.text()).slice(0, 400)
      failed += chunk.length
      errors.push(`${resp.status}: ${detail}`)
    }
    if (i + 100 < messages.length) await sleep(600)
  }

  return { sent, failed, errors }
}

export type SendResult = {
  sent: number
  failed: number
  posts: number
  subscribers: number
  subject?: string
  errors?: string[]
  message: string
  scheduledFor?: string
}

/**
 * Envía el newsletter con los artículos recientes.
 * - `dryRun`: no envía, devuelve el HTML para revisar.
 * - `to`: envía una única prueba a esa dirección (no toca la base de suscriptores).
 */
export async function sendWeeklyNewsletter(
  opts: { days?: number; dryRun?: boolean; to?: string } = {}
): Promise<SendResult> {
  const days = opts.days ?? 7
  const posts = await getRecentPosts(days)

  if (posts.length === 0) {
    return {
      sent: 0,
      failed: 0,
      posts: 0,
      subscribers: 0,
      message: `No hay artículos publicados en los últimos ${days} días`,
    }
  }

  const subject =
    posts.length === 1
      ? `Nuevo en el blog: ${posts[0].title}`
      : `Nuevo en Psicobahamondes: ${posts.length} artículos`

  // Prueba: un único destinatario, marcado como tal y sin enlace de baja real.
  if (opts.to) {
    const html = buildNewsletterHTML(posts, { previewText: 'Prueba de envío del newsletter' }).replace(
      'Darme de baja',
      'Darme de baja (deshabilitado en prueba)'
    )
    const result = await sendBatch([
      { from: FROM, to: [opts.to], subject: `[PRUEBA] ${subject}`, html, ...(REPLY_TO ? { reply_to: REPLY_TO } : {}) },
    ])
    return {
      sent: result.sent,
      failed: result.failed,
      posts: posts.length,
      subscribers: 1,
      subject: `[PRUEBA] ${subject}`,
      errors: result.errors,
      message: result.sent ? `Prueba enviada a ${opts.to}` : 'Falló el envío de prueba',
    }
  }

  if (opts.dryRun) {
    return {
      sent: 0,
      failed: 0,
      posts: posts.length,
      subscribers: (await getActiveSubscribers()).length,
      subject,
      message: 'Dry run: no se envió nada',
    }
  }

  const subscribers = await getActiveSubscribers()
  if (subscribers.length === 0) {
    return {
      sent: 0,
      failed: 0,
      posts: posts.length,
      subscribers: 0,
      subject,
      message: 'No hay suscriptores activos',
    }
  }

  const messages: OutgoingEmail[] = subscribers.map((s) => ({
    from: FROM,
    to: [s.email],
    subject,
    html: buildNewsletterHTML(posts, { unsubscribeUrl: unsubscribeUrl(s.email) }),
    ...(REPLY_TO ? { reply_to: REPLY_TO } : {}),
  }))

  const result = await sendBatch(messages)

  return {
    sent: result.sent,
    failed: result.failed,
    posts: posts.length,
    subscribers: subscribers.length,
    subject,
    ...(result.errors.length ? { errors: result.errors } : {}),
    message: `Newsletter enviado a ${result.sent} de ${subscribers.length} suscriptores`,
  }
}
