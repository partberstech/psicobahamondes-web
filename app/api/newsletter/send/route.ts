import { NextResponse } from 'next/server'
import { sendWeeklyNewsletter } from '@/lib/newsletter'
import { isNewsletterAuthorized } from '@/lib/newsletter-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const maxDuration = 60

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
}

/**
 * Dispara el envío del newsletter.
 *
 * Requiere secreto (Authorization: Bearer <secreto> o ?token=<secreto>).
 * Parámetros opcionales:
 *   ?days=7        ventana de artículos
 *   ?dryRun=1      no envía, solo calcula
 *   ?to=correo     envía una única prueba a esa dirección
 *   ?preview=1     devuelve el HTML del correo (text/html)
 */
async function handle(request: Request) {
  if (!isNewsletterAuthorized(request)) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401, headers: NO_STORE }
    )
  }

  const url = new URL(request.url)
  const days = Math.min(Math.max(Number(url.searchParams.get('days') || 7) || 7, 1), 90)
  const dryRun = url.searchParams.get('dryRun') === '1'
  const preview = url.searchParams.get('preview') === '1'
  const to = url.searchParams.get('to') || undefined

  try {
    if (preview) {
      const { buildNewsletterHTML, getRecentPosts } = await import('@/lib/newsletter')
      const posts = await getRecentPosts(days)
      if (posts.length === 0) {
        return new Response('<p style="font-family:sans-serif;padding:24px">No hay artículos en la ventana indicada.</p>', {
          status: 200,
          headers: { ...NO_STORE, 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
      const html = buildNewsletterHTML(posts, { previewText: 'Vista previa del newsletter' })
      return new Response(html, {
        status: 200,
        headers: { ...NO_STORE, 'Content-Type': 'text/html; charset=utf-8' },
      })
    }

    const result = await sendWeeklyNewsletter({ days, dryRun, to })
    return NextResponse.json(result, { headers: NO_STORE })
  } catch (err: any) {
    console.error('[newsletter:send] error:', err)
    return NextResponse.json(
      { error: err?.message || 'Error al procesar el newsletter' },
      { status: 500, headers: NO_STORE }
    )
  }
}

/** Vercel Cron llama con GET. */
export async function GET(request: Request) {
  return handle(request)
}

/** Envío manual (mismos parámetros por query string). */
export async function POST(request: Request) {
  return handle(request)
}
