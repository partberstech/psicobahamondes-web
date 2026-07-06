export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const checks = {
    turso_url: !!process.env.TURSO_DATABASE_URL,
    resend_key: !!process.env.RESEND_API_KEY,
    email_from: process.env.EMAIL_FROM || 'not set',
    admin_email: process.env.ADMIN_EMAIL || 'not set',
    node_env: process.env.NODE_ENV,
    vercel_env: process.env.VERCEL_ENV || 'not set',
  }
  return new Response(JSON.stringify(checks, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
