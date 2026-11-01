const NOTION_KEY = process.env.NOTION_API_KEY || ''
const NOTION_VERSION = '2022-06-28'
const DB_ID = '397bedc4-2b9f-813f-9136-f598ec9f5cc2'

/** Tope de anidamiento al recorrer bloques hijos (evita bucles patológicos). */
const MAX_DEPTH = 4
/** Máximo de páginas de 100 bloques por nivel (evita respuestas infinitas). */
const MAX_BLOCK_PAGES = 20

// ─────────────────────────────────────────────────────────────
// Tipos de contenido
// ─────────────────────────────────────────────────────────────

/** Fragmento de texto con sus marcas de formato de Notion. */
export type Inline = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  underline?: boolean
  strikethrough?: boolean
  link?: string
}

export type ListItem = {
  rich: Inline[]
  /** 0 = nivel base, 1 = sub-ítem. */
  depth: number
}

export type TableRow = { cells: Inline[][] }

export type RichBlock =
  | { type: 'paragraph'; rich: Inline[] }
  | { type: 'heading'; level: 1 | 2 | 3; rich: Inline[]; id: string }
  | { type: 'list'; ordered: boolean; items: ListItem[] }
  | { type: 'quote'; rich: Inline[] }
  | { type: 'divider' }
  | { type: 'image'; url: string; caption: Inline[] }
  | { type: 'code'; text: string; language: string }
  | { type: 'callout'; rich: Inline[]; emoji: string }
  | { type: 'toggle'; rich: Inline[]; children: RichBlock[] }
  | { type: 'video'; url: string }
  | { type: 'bookmark'; url: string; title: string }
  | { type: 'todo'; rich: Inline[]; checked: boolean }
  | { type: 'table'; rows: TableRow[]; hasHeader: boolean }

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
  /** Portada de la página de Notion (null si no tiene). */
  cover: string | null
}

export type BlogPostFull = BlogPost & {
  /** Cuerpo en markdown plano (compatibilidad). */
  content: string
  /** Cuerpo estructurado para render con diseño. */
  blocks: RichBlock[]
  /** Minutos de lectura estimados (200 palabras/min). */
  readTime: number
}

// ─────────────────────────────────────────────────────────────
// Cliente HTTP
// ─────────────────────────────────────────────────────────────

async function notionFetch(path: string, options?: RequestInit) {
  const resp = await fetch(`https://api.notion.com/v1${path}`, {
    ...options,
    // Sin caché: cada request consulta Notion en vivo. Esto además marca
    // la ruta de Next como dinámica, así Vercel no la congela en el build.
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!resp.ok) {
    const err = await resp.text()
    console.error('[notion] fetch error:', path, resp.status, err)
    return null
  }
  return resp.json()
}

// ─────────────────────────────────────────────────────────────
// Extractores de propiedades
// ─────────────────────────────────────────────────────────────

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

/** Resuelve la URL de un objeto `file`/`external` de Notion. */
function fileUrl(obj: any): string {
  if (!obj) return ''
  if (obj.type === 'external') return obj.external?.url || ''
  if (obj.type === 'file') return obj.file?.url || ''
  return obj.url || ''
}

/** Convierte `rich_text` de Notion en fragmentos con formato. */
function toInline(rich: any): Inline[] {
  if (!Array.isArray(rich)) return []
  const out: Inline[] = []
  for (const t of rich) {
    const text = t?.plain_text ?? ''
    if (!text) continue
    const a = t.annotations || {}
    const item: Inline = { text }
    if (a.bold) item.bold = true
    if (a.italic) item.italic = true
    if (a.code) item.code = true
    if (a.underline) item.underline = true
    if (a.strikethrough) item.strikethrough = true
    if (t.href) item.link = t.href
    out.push(item)
  }
  return out
}

function inlineToPlain(inline: Inline[]): string {
  return inline.map((s) => s.text).join('')
}

/** Genera un ancla estable y legible a partir de un título. */
function headingId(raw: string, used: Set<string>): string {
  const base =
    raw
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60) || 'seccion'
  let id = base
  let n = 2
  while (used.has(id)) {
    id = `${base}-${n}`
    n += 1
  }
  used.add(id)
  return id
}

// ─────────────────────────────────────────────────────────────
// Lectura de bloques (con paginación real)
// ─────────────────────────────────────────────────────────────

/** Trae TODOS los hijos de un bloque, siguiendo `has_more`/`next_cursor`. */
async function fetchChildren(blockId: string): Promise<any[]> {
  const all: any[] = []
  let cursor: string | undefined
  for (let page = 0; page < MAX_BLOCK_PAGES; page += 1) {
    const params = new URLSearchParams({ page_size: '100' })
    if (cursor) params.set('start_cursor', cursor)
    const data: any = await notionFetch(`/blocks/${blockId}/children?${params.toString()}`)
    if (!data?.results) break
    all.push(...data.results)
    if (!data.has_more || !data.next_cursor) break
    cursor = data.next_cursor
  }
  return all
}

type ConvertCtx = { used: Set<string> }

async function toRichBlocks(blocks: any[], depth: number, ctx: ConvertCtx): Promise<RichBlock[]> {
  const out: RichBlock[] = []
  let list: { ordered: boolean; items: ListItem[] } | null = null

  const flushList = () => {
    if (list && list.items.length) {
      out.push({ type: 'list', ordered: list.ordered, items: list.items })
    }
    list = null
  }

  for (const b of blocks) {
    const t = b?.type
    if (!t) continue
    const data = b[t] || {}

    // ── Listas: se agrupan ítems consecutivos en un solo bloque ──
    if (t === 'bulleted_list_item' || t === 'numbered_list_item') {
      const ordered = t === 'numbered_list_item'
      if (list && list.ordered !== ordered) flushList()
      if (!list) list = { ordered, items: [] }
      list.items.push({ rich: toInline(data.rich_text), depth: 0 })

      // Sub-ítems anidados: se aplanan dentro de la misma lista.
      if (b.has_children && depth < MAX_DEPTH) {
        const kids = await fetchChildren(b.id)
        const nested = await toRichBlocks(kids, depth + 1, ctx)
        for (const n of nested) {
          if (n.type === 'list') {
            n.items.forEach((it) => list!.items.push({ rich: it.rich, depth: 1 }))
          } else if (n.type === 'paragraph') {
            if (inlineToPlain(n.rich).trim()) {
              list!.items.push({ rich: n.rich, depth: 1 })
            }
          }
        }
      }
      continue
    }

    flushList()

    switch (t) {
      case 'paragraph': {
        const rich = toInline(data.rich_text)
        if (inlineToPlain(rich).trim()) out.push({ type: 'paragraph', rich })
        break
      }

      case 'heading_1':
      case 'heading_2':
      case 'heading_3': {
        const rich = toInline(data.rich_text)
        const plain = inlineToPlain(rich).trim()
        if (!plain) break
        const level = (t === 'heading_1' ? 1 : t === 'heading_2' ? 2 : 3) as 1 | 2 | 3
        out.push({ type: 'heading', level, rich, id: headingId(plain, ctx.used) })
        break
      }

      case 'quote': {
        const rich = toInline(data.rich_text)
        if (inlineToPlain(rich).trim()) out.push({ type: 'quote', rich })
        break
      }

      case 'divider':
        out.push({ type: 'divider' })
        break

      case 'image': {
        const url = fileUrl(data)
        if (url) out.push({ type: 'image', url, caption: toInline(data.caption) })
        break
      }

      case 'code': {
        const text = inlineToPlain(toInline(data.rich_text))
        if (text.trim()) {
          out.push({ type: 'code', text, language: String(data.language || 'plain text') })
        }
        break
      }

      case 'callout': {
        const rich = toInline(data.rich_text)
        const emoji = data.icon?.emoji || '💡'
        if (inlineToPlain(rich).trim()) out.push({ type: 'callout', rich, emoji })
        break
      }

      case 'toggle': {
        const rich = toInline(data.rich_text)
        let children: RichBlock[] = []
        if (b.has_children && depth < MAX_DEPTH) {
          children = await toRichBlocks(await fetchChildren(b.id), depth + 1, ctx)
        }
        out.push({ type: 'toggle', rich, children })
        break
      }

      case 'to_do': {
        const rich = toInline(data.rich_text)
        if (inlineToPlain(rich).trim()) {
          out.push({ type: 'todo', rich, checked: Boolean(data.checked) })
        }
        break
      }

      case 'video': {
        const url = fileUrl(data) || data.url || ''
        if (url) out.push({ type: 'video', url })
        break
      }

      case 'embed':
      case 'bookmark':
      case 'link_preview': {
        const url = data.url || fileUrl(data)
        if (url) out.push({ type: 'bookmark', url, title: inlineToPlain(toInline(data.caption)) })
        break
      }

      case 'file':
      case 'pdf': {
        const url = fileUrl(data)
        const name = inlineToPlain(toInline(data.caption)) || data.name || 'Documento adjunto'
        if (url) out.push({ type: 'bookmark', url, title: name })
        break
      }

      case 'table': {
        if (b.has_children && depth < MAX_DEPTH) {
          const rawRows = await fetchChildren(b.id)
          const rows: TableRow[] = []
          for (const row of rawRows) {
            if (row.type !== 'table_row') continue
            const cells = Array.isArray(row.table_row?.cells) ? row.table_row.cells : []
            if (cells.length === 0) continue
            rows.push({ cells: cells.map((cell: any[]) => toInline(cell)) })
          }
          if (rows.length) {
            out.push({
              type: 'table',
              rows,
              hasHeader: Boolean(data.has_column_header),
            })
          }
        }
        break
      }

      case 'column_list':
      case 'column':
      case 'synced_block': {
        if (b.has_children && depth < MAX_DEPTH) {
          const kids = await toRichBlocks(await fetchChildren(b.id), depth + 1, ctx)
          out.push(...kids)
        }
        break
      }

      default:
        // Bloques no soportados (child_page, link_to_page, table_of_contents…)
        // se ignoran de forma explícita en lugar de romper el render.
        break
    }
  }

  flushList()
  return out
}

/** Serializa los bloques a markdown plano (compatibilidad con consumidores previos). */
function blocksToMarkdown(blocks: RichBlock[]): string {
  const lines: string[] = []
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
        lines.push(`${'#'.repeat(b.level)} ${inlineToPlain(b.rich)}`)
        break
      case 'paragraph':
        lines.push(inlineToPlain(b.rich))
        break
      case 'quote':
        lines.push(`> ${inlineToPlain(b.rich)}`)
        break
      case 'list':
        b.items.forEach((it, i) => {
          lines.push(`${b.ordered ? `${i + 1}.` : '-'} ${inlineToPlain(it.rich)}`)
        })
        break
      case 'divider':
        lines.push('---')
        break
      case 'image':
        lines.push(`![${inlineToPlain(b.caption)}](${b.url})`)
        break
      case 'code':
        lines.push(`\`\`\`${b.language}\n${b.text}\n\`\`\``)
        break
      case 'callout':
        lines.push(`> ${inlineToPlain(b.rich)}`)
        break
      case 'toggle':
        lines.push(inlineToPlain(b.rich))
        break
      case 'todo':
        lines.push(`- [${b.checked ? 'x' : ' '}] ${inlineToPlain(b.rich)}`)
        break
      case 'video':
      case 'bookmark':
        lines.push(b.url)
        break
      case 'table':
        b.rows.forEach((r) =>
          lines.push(r.cells.map((c) => inlineToPlain(c)).join(' | '))
        )
        break
    }
    lines.push('')
  }
  return lines.join('\n').trim()
}

function countWords(blocks: RichBlock[]): number {
  let n = 0
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
      case 'paragraph':
      case 'quote':
      case 'callout':
      case 'toggle':
      case 'todo':
        n += inlineToPlain(b.rich).split(/\s+/).filter(Boolean).length
        break
      case 'list':
        b.items.forEach((it) => {
          n += inlineToPlain(it.rich).split(/\s+/).filter(Boolean).length
        })
        break
      case 'code':
        n += b.text.split(/\s+/).filter(Boolean).length
        break
      case 'table':
        b.rows.forEach((r) => {
          r.cells.forEach((c) => {
            n += inlineToPlain(c).split(/\s+/).filter(Boolean).length
          })
        })
        break
      default:
        break
    }
  }
  return n
}

// ─────────────────────────────────────────────────────────────
// Mapeo de página → post
// ─────────────────────────────────────────────────────────────

function mapPageToProps(page: any): BlogPost | null {
  const p = page.properties || {}
  const post: BlogPost = {
    id: page.id,
    title: extractText(p['Título']),
    slug: extractText(p.Slug),
    excerpt: extractText(p.Extracto),
    category: extractSelect(p['Categoría']),
    type: extractSelect(p.Tipo),
    date: extractDate(p.Fecha),
    videoUrl: extractUrl(p['Video URL']),
    published: extractCheckbox(p.Publicado),
    cover: fileUrl(page.cover) || null,
  }
  if (!post.published || !post.title) return null
  return post
}

// ─────────────────────────────────────────────────────────────
// API pública
// ─────────────────────────────────────────────────────────────

export async function listPosts(): Promise<BlogPost[]> {
  if (!NOTION_KEY) return []
  const data: any = await notionFetch(`/databases/${DB_ID}/query`, {
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
  const data: any = await notionFetch(`/databases/${DB_ID}/query`, {
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

  // Contenido completo, con paginación y bloques anidados.
  const blocks = await toRichBlocks(await fetchChildren(page.id), 0, { used: new Set<string>() })

  const words = countWords(blocks)
  const readTime = Math.max(1, Math.round(words / 200))

  return {
    ...post,
    content: blocksToMarkdown(blocks),
    blocks,
    readTime,
  }
}
