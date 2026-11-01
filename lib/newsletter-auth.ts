/** Secreto compartido para disparar envíos y ver la vista previa. */
export function newsletterSecret(): string {
  return process.env.CRON_SECRET || process.env.NEWSLETTER_SECRET || ''
}

function safeEqual(a: string, b: string): boolean {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/**
 * Acepta `Authorization: Bearer <secreto>` (lo que envía Vercel Cron)
 * o `?token=<secreto>` para pruebas manuales.
 */
export function isNewsletterAuthorized(req: Request): boolean {
  const secret = newsletterSecret()
  if (!secret) return false

  const auth = req.headers.get('authorization') || ''
  if (auth.startsWith('Bearer ')) {
    if (safeEqual(auth.slice(7).trim(), secret)) return true
  }

  try {
    const token = new URL(req.url).searchParams.get('token') || ''
    return safeEqual(token, secret)
  } catch {
    return false
  }
}
