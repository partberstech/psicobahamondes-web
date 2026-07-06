import { NextResponse } from 'next/server'
import { listSocialPosts } from '@/lib/social'

export async function GET() {
  try {
    const posts = await listSocialPosts()
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[api/social] error:', err)
    return NextResponse.json({ posts: [], error: 'Failed to fetch social posts' })
  }
}
