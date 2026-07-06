const NOTION_KEY = process.env.NOTION_API_KEY || ''
const SOCIAL_DB = '395bedc4-2b9f-8171-8d2e-f7addc7fff51'

export type SocialPost = {
  id: string
  title: string
  url: string
  network: string
  date: string
  published: boolean
}

async function notionFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!resp.ok) {
    const err = await resp.text()
    console.error('[notion-social] error:', path, err)
    return null
  }
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

function extractUrl(prop: any): string {
  return prop?.url || ''
}

export async function listSocialPosts(): Promise<SocialPost[]> {
  if (!NOTION_KEY) return []
  const data = await notionFetch(`/databases/${SOCIAL_DB}/query`, {
    method: 'POST',
    body: JSON.stringify({
      sorts: [{ property: 'Fecha', direction: 'descending' }],
    }),
  })
  if (!data?.results) return []
  return data.results.map((page: any) => {
    const p = page.properties
    const post: SocialPost = {
      id: page.id,
      title: extractText(p.Título),
      url: extractUrl(p['URL de la publicación']),
      network: extractSelect(p['Red social']),
      date: extractDate(p.Fecha),
      published: extractCheckbox(p.Publicado),
    }
    if (!post.published || !post.title) return null
    return post
  }).filter(Boolean)
}

export const platformMeta: Record<string, { bg: string; color: string; label: string; svg: string }> = {
  Instagram: { bg: '#fef2f2', color: '#e1306c', label: 'Instagram',
    svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e1306c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="#e1306c"/></svg>' },
  Facebook: { bg: '#eff6ff', color: '#1877f2', label: 'Facebook',
    svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1877f2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
  YouTube: { bg: '#fef2f2', color: '#ff0000', label: 'YouTube',
    svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98" fill="#ff0000"/></svg>' },
  LinkedIn: { bg: '#f0f9ff', color: '#0a66c2', label: 'LinkedIn',
    svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a66c2" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>' },
  'Twitter/X': { bg: '#f3f4f6', color: '#000000', label: 'X',
    svg: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16M20 4L4 20"/></svg>' },
}
