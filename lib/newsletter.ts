const NOTION_KEY = process.env.NOTION_API_KEY || ''
const NOTION_VERSION = '2022-06-28'
const BLOG_DB = '397bedc4-2b9f-813f-9136-f598ec9f5cc2'
const SUBSCRIBERS_DB = '397bedc4-2b9f-8103-8654-d3c5cd056bf3'
const RESEND_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = 'newsletter@psicobahamondes.cl'
const SITE_URL = 'https://psicobahamondes.cl'

async function notionFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!resp.ok) return null
  return resp.json()
}

function extractText(prop: any): string {
  if (!prop) return ''
  if (prop.title) return prop.title.map((t: any) => t.plain_text).join('')
  if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text).join('')
  return ''
}

function extractSelect(prop: any): string {
  return prop?.select?.name || ''
}

function extractDate(prop: any): string {
  return prop?.date?.start || ''
}

function extractCheckbox(prop: any): boolean {
  return prop?.checkbox || false
}

// Fetch published blog posts from last 7 days
export async function getRecentPosts() {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const dateStr = sevenDaysAgo.toISOString().split('T')[0]

  const data = await notionFetch(`/databases/${BLOG_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Fecha', date: { on_or_after: dateStr } }
        ]
      },
      sorts: [{ property: 'Fecha', direction: 'descending' }]
    })
  })

  if (!data?.results) return []

  return data.results
    .map((page: any) => ({
      id: page.id,
      title: extractText(page.properties['Título']),
      slug: extractText(page.properties['Slug']),
      excerpt: extractText(page.properties['Extracto']),
      category: extractSelect(page.properties['Categoría']),
      type: extractSelect(page.properties['Tipo']),
      date: extractDate(page.properties['Fecha']),
      published: extractCheckbox(page.properties['Publicado']),
    }))
    .filter((p: any) => p.published && p.title)
}

// Fetch active subscribers
export async function getActiveSubscribers() {
  const data = await notionFetch(`/databases/${SUBSCRIBERS_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({})
  })

  if (!data?.results) return []

  return data.results
    .map((page: any) => ({
      email: extractText(page.properties['Email']),
      name: extractText(page.properties['Nombre']),
      estado: extractSelect(page.properties['Estado']),
    }))
    .filter((s: any) => s.email && s.estado === 'Activo')
}

// Send email via Resend
export async function sendEmail(to: string[], subject: string, html: string) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    }),
  })
  return resp.ok
}

// Build newsletter HTML
export function buildNewsletterHTML(posts: any[], siteUrl: string = SITE_URL) {
  const postRows = posts.map(post => `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #f3f4f6;">
        <a href="${siteUrl}/blog/${post.slug}" style="color:#111827;text-decoration:none;">
          <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;background:#eff6ff;color:#2563eb;margin-bottom:6px;">${post.category}</span>
          <h3 style="margin:6px 0 4px;font-size:16px;font-weight:700;color:#111827;">${post.title}</h3>
          <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.5;">${post.excerpt || ''}</p>
          <span style="display:inline-block;margin-top:8px;font-size:13px;font-weight:600;color:#2563eb;">Leer artículo →</span>
        </a>
      </td>
    </tr>
  `).join('')

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.04);">
          <tr>
            <td style="padding:32px 32px 16px;">
              <h1 style="margin:0;font-size:20px;font-weight:800;color:#111827;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;">🧠 Newsletter Psicobahamondes</h1>
              <p style="margin:8px 0 0;font-size:14px;color:#6b7280;">Tu dosis semanal de consciencia y bienestar</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${postRows}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;text-align:center;border-top:1px solid #f3f4f6;">
              <a href="${siteUrl}/blog" style="display:inline-block;padding:12px 28px;background:#111827;color:#ffffff;border-radius:12px;font-size:14px;font-weight:700;text-decoration:none;font-family:'Plus Jakarta Sans',Helvetica,Arial,sans-serif;">Explorar más contenido</a>
              <p style="margin:16px 0 0;font-size:12px;color:#9ca3af;">Recibes este email porque te suscribiste al newsletter de Psicobahamondes.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
}

// Main function: fetch posts, get subscribers, send newsletter
export async function sendWeeklyNewsletter() {
  const posts = await getRecentPosts()
  if (posts.length === 0) {
    return { sent: 0, posts: 0, message: 'No hay posts nuevos esta semana' }
  }

  const subscribers = await getActiveSubscribers()
  if (subscribers.length === 0) {
    return { sent: 0, posts: posts.length, message: 'No hay suscriptores activos' }
  }

  const html = buildNewsletterHTML(posts)
  const subject = `🧠 Newsletter Psicobahamondes — ${posts.length} artículo${posts.length > 1 ? 's' : ''} nuevo${posts.length > 1 ? 's' : ''}`
  const recipients: string[] = subscribers.map((s: any) => s.email)

  // Send in batches of 50 (Resend limit)
  let sent = 0
  for (let i = 0; i < recipients.length; i += 50) {
    const batch = recipients.slice(i, i + 50)
    const ok = await sendEmail(batch, subject, html)
    if (ok) sent += batch.length
  }

  return { sent, posts: posts.length, message: `Newsletter enviado a ${sent} suscriptores` }
}
