import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/notion'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
}

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404, headers: NO_STORE })
    }
    return NextResponse.json({ post }, { headers: NO_STORE })
  } catch (err) {
    console.error('[api/blog/slug] error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500, headers: NO_STORE }
    )
  }
}
