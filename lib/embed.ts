/** Convierte URLs de YouTube/Vimeo en URLs reproducibles en iframe. */
export function toEmbedUrl(url: string): string {
  if (!url) return ''
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return `https://www.youtube.com/embed/${v}`
      const parts = u.pathname.split('/').filter(Boolean)
      if ((parts[0] === 'embed' || parts[0] === 'shorts') && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`
      }
    }

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      if (id) return `https://www.youtube.com/embed/${id}`
    }

    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const id = u.pathname.split('/').filter(Boolean).find((p) => /^\d+$/.test(p))
      if (id) return `https://player.vimeo.com/video/${id}`
    }

    return url
  } catch {
    return url.replace('watch?v=', 'embed/')
  }
}
