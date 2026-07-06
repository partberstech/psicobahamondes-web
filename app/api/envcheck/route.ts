import { createClient } from '@libsql/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const url = process.env.TURSO_DATABASE_URL || '(not set)'
  const token = process.env.TURSO_AUTH_TOKEN || '(not set)'
  const tests: Record<string, unknown> = {
    turso_url_set: !!process.env.TURSO_DATABASE_URL,
    turso_token_set: !!process.env.TURSO_AUTH_TOKEN,
    url_prefix: url.slice(0, 20),
    token_len: token.length,
  }

  if (process.env.TURSO_DATABASE_URL) {
    try {
      const db = createClient({
        url: process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      })
      const r = await db.execute("SELECT COUNT(*) as cnt FROM bookings")
      tests.turso_query_ok = true
      tests.bookings_count = r.rows[0].cnt as number
    } catch (e: unknown) {
      tests.turso_query_ok = false
      tests.turso_error = e instanceof Error ? e.message : String(e)
      tests.turso_error_name = e instanceof Error ? e.name : typeof e
    }
  }

  return new Response(JSON.stringify(tests, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
}
