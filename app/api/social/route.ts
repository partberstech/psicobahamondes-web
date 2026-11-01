import { NextResponse } from 'next/server'
import { listSocialPosts } from '@/lib/social'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
}

export async function GET() {
  try {
    const posts = await listSocialPosts()
    return NextResponse.json({ posts }, { headers: NO_STORE })
  } catch (err) {
    console.error('[api/social] error:', err)
    return NextResponse.json(
      { posts: [], error: 'Failed to fetch social posts' },
      { headers: NO_STORE }
    )
  }
}
