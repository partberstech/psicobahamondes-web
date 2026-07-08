import { NextResponse } from 'next/server'

const NOTION_KEY = process.env.NOTION_API_KEY || ''
const DB_ID = '397bedc4-2b9f-8103-8654-d3c5cd056bf3'

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
    const err = await resp.json().catch(() => ({}))
    throw new Error(err.message || 'Notion API error')
  }
  return resp.json()
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await notionFetch(
      `/databases/${DB_ID}/query`,
      {
        method: 'POST',
        body: JSON.stringify({
          filter: {
            property: 'Email',
            title: { equals: email.toLowerCase().trim() }
          }
        })
      }
    )

    if (existing.results.length > 0) {
      return NextResponse.json({ 
        message: 'Ya estás suscrito',
        alreadySubscribed: true 
      })
    }

    // Create new subscriber
    await notionFetch('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: DB_ID },
        properties: {
          Email: { title: [{ text: { content: email.toLowerCase().trim() } }] },
          Nombre: { rich_text: name ? [{ text: { content: name } }] : [] },
          'Fecha de suscripción': { date: { start: new Date().toISOString() } },
          Estado: { select: { name: 'Activo' } },
          Fuente: { select: { name: 'Sitio Web' } }
        }
      })
    })

    return NextResponse.json({ 
      message: '¡Suscripción exitosa!',
      alreadySubscribed: false 
    })
  } catch (err: any) {
    console.error('Newsletter subscription error:', err)
    return NextResponse.json({ error: 'Error al procesar la suscripción' }, { status: 500 })
  }
}
