import { NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/notion'

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)
    if (!post) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ post })
  } catch (err) {
    console.error('[api/blog/slug] error:', err)
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}
