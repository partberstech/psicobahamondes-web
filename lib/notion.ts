const NOTION_KEY = process.env.NOTION_API_KEY || ''
const DB_ID = '395bedc4-2b9f-819e-ba58-e53db65b265c'

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  type: string
  date: string
  videoUrl: string | null
  published: boolean
}

export type BlogPostFull = BlogPost & {
  content: string
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
    console.error('[notion] fetch error:', path, err)
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

function extractUrl(prop: any): string | null {
  return prop?.url || null
}

function extractDate(prop: any): string {
  return prop?.date?.start || ''
}

function extractCheckbox(prop: any): boolean {
  return prop?.checkbox || false
}

function mapPageToProps(page: any): BlogPost | null {
  const p = page.properties
  const post: BlogPost = {
    id: page.id,
    title: extractText(p.Título),
    slug: extractText(p.Slug),
    excerpt: extractText(p.Extracto),
    category: extractSelect(p.Categoría),
    type: extractSelect(p.Tipo),
    date: extractDate(p.Fecha),
    videoUrl: extractUrl(p['Video URL']),
    published: extractCheckbox(p.Publicado),
  }
  if (!post.published || !post.title) return null
  return post
}

export async function listPosts(): Promise<BlogPost[]> {
  if (!NOTION_KEY) return []
  const data = await notionFetch(`/databases/${DB_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      sorts: [{ property: 'Fecha', direction: 'descending' }],
    }),
  })
  if (!data?.results) return []
  return data.results.map(mapPageToProps).filter(Boolean) as BlogPost[]
}

export async function getPostBySlug(slug: string): Promise<BlogPostFull | null> {
  if (!NOTION_KEY) return null
  const data = await notionFetch(`/databases/${DB_ID}/query`, {
    method: 'POST',
    body: JSON.stringify({
      filter: {
        and: [
          { property: 'Slug', rich_text: { equals: slug } },
          { property: 'Publicado', checkbox: { equals: true } },
        ],
      },
    }),
  })
  if (!data?.results?.[0]) return null
  const page = data.results[0]
  const post = mapPageToProps(page)
  if (!post) return null

  // Fetch page content (blocks) as markdown
  const pageId = page.id.replace(/-/g, '')
  const blocksResp = await notionFetch(`/blocks/${pageId}/children?page_size=50`)
  const blocks = blocksResp?.results || []
  const content = blocks
    .map((b: any) => {
      switch (b.type) {
        case 'paragraph':
          return b.paragraph.rich_text.map((t: any) => t.plain_text).join('')
        case 'heading_1':
          return `\n# ${b.heading_1.rich_text.map((t: any) => t.plain_text).join('')}\n`
        case 'heading_2':
          return `\n## ${b.heading_2.rich_text.map((t: any) => t.plain_text).join('')}\n`
        case 'heading_3':
          return `\n### ${b.heading_3.rich_text.map((t: any) => t.plain_text).join('')}\n`
        case 'bulleted_list_item':
          return `- ${b.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('')}`
        case 'numbered_list_item':
          return `1. ${b.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('')}`
        case 'quote':
          return `> ${b.quote.rich_text.map((t: any) => t.plain_text).join('')}`
        case 'divider':
          return '\n---\n'
        default:
          return ''
      }
    })
    .filter(Boolean)
    .join('\n\n')

  return { ...post, content }
}
