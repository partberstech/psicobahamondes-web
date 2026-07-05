import { createClient } from '@libsql/client'

function tursoUrl() { return process.env.TURSO_DATABASE_URL || '' }
function authToken() { return process.env.TURSO_AUTH_TOKEN || '' }

export function getDb() {
  const url = tursoUrl()
  const token = authToken()
  const useTurso = url.startsWith('libsql://')
  return createClient(useTurso ? { url, authToken: token } : { url })
}

export async function migrate() {
  const db = getDb()
  await db.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      session_type TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
}

export type SessionType = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

export type Booking = {
  id: string
  session_type: SessionType
  name: string
  email: string
  phone: string
  date: string
  time: string
  status: string
  created_at: string
}

// Escapes single quotes for safe inline SQL (date/sessionType are validated against regexp)
function esc(s: string) { return `'${s.replace(/'/g, "''")}'` }

export async function queryBookedTimes(date: string, sessionType: SessionType): Promise<Set<string>> {
  if (!tursoUrl()) return new Set()
  try {
    const db = getDb()
    const sql = `SELECT time FROM bookings WHERE date = ${esc(date)} AND session_type = ${esc(sessionType)} AND status = 'confirmed'`
    const result = await db.execute(sql)
    return new Set(result.rows.map((r: any) => r.time as string))
  } catch (e) {
    console.error('[db] queryBookedTimes error:', e)
    return new Set()
  }
}
