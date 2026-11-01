import { emailFromToken, unsubscribeEmail } from '@/lib/newsletter'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const NO_STORE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
}

function page(title: string, message: string, status = 200): Response {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${title} — Psicobahamondes</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr>
      <td align="center" style="padding:64px 20px;">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="width:100%;max-width:520px;background:#ffffff;border:1px solid rgba(0,0,0,0.06);border-radius:20px;">
          <tr>
            <td style="padding:32px 32px 8px;">
              <p style="margin:0 0 18px;font-size:10px;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;color:#2563eb;">Psicobahamondes</p>
              <h1 style="margin:0 0 12px;font-size:24px;line-height:1.25;font-weight:800;color:#111827;letter-spacing:-0.02em;">${title}</h1>
              <p style="margin:0;font-size:15px;line-height:1.7;color:#6b7280;">${message}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:26px 32px 32px;">
              <a href="https://www.psicobahamondes.cl" style="display:inline-block;padding:12px 24px;background:#111827;color:#ffffff;border-radius:999px;font-size:13px;font-weight:700;text-decoration:none;">Volver al sitio</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return new Response(html, {
    status,
    headers: { ...NO_STORE, 'Content-Type': 'text/html; charset=utf-8' },
  })
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') || ''
  const email = emailFromToken(token)

  if (!email) {
    return page(
      'Enlace inválido',
      'Este enlace de baja no es válido o fue alterado. Si quieres dejar de recibir el newsletter, escríbenos y lo hacemos manualmente.',
      400
    )
  }

  try {
    const ok = await unsubscribeEmail(email)
    if (!ok) {
      return page(
        'No encontramos esa suscripción',
        'Puede que ya estés dado de baja. Si sigues recibiendo correos, escríbenos y lo revisamos.'
      )
    }
    return page(
      'Listo, te dimos de baja',
      'No volverás a recibir el newsletter de Psicobahamondes. Si fue un error, puedes suscribirte de nuevo en cualquier momento desde el blog.'
    )
  } catch (err) {
    console.error('[newsletter:unsubscribe] error:', err)
    return page('No pudimos procesar la baja', 'Ocurrió un error inesperado. Inténtalo de nuevo en unos minutos.', 500)
  }
}
