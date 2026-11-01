import { NextResponse } from 'next/server'
import { listPosts } from '@/lib/notion'

// Siempre dinámico: nunca se prerenderiza ni se congela en el build.
export const dynamic = 'force-dynamic'
export const revalidate = 0

/** Cabeceras que impiden cachear en navegador y en el CDN de Vercel. */
const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
}

export async function GET() {
  try {
    const posts = await listPosts()
    return NextResponse.json(
      { posts, updatedAt: new Date().toISOString() },
      { headers: NO_STORE }
    )
  } catch (err) {
    console.error('[api/blog] error:', err)
    return NextResponse.json(
      { posts: [], error: 'Failed to fetch blog posts' },
      { headers: NO_STORE }
    )
  }
}
