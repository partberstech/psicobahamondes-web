import { NextResponse } from 'next/server'
import { listPosts } from '@/lib/notion'

export async function GET() {
  try {
    const posts = await listPosts()
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[api/blog] error:', err)
    return NextResponse.json({ posts: [], error: 'Failed to fetch blog posts' })
  }
}
