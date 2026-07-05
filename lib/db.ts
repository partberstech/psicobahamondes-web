import { createClient } from '@libsql/client'

const url = process.env.TURSO_DATABASE_URL || 'file:data/bookings.db'
const authToken = process.env.TURSO_AUTH_TOKEN

let client: ReturnType<typeof createClient> | null = null

export function getDb() {
  if (client) return client
  client = createClient(url.startsWith('file:') ? { url } : { url, authToken })
  return client
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
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_bookings_date_time
    ON bookings(date, time, session_type)
  `)
}

export type Booking = {
  id: string
  session_type: string
  name: string
  email: string
  phone: string
  date: string
  time: string
  status: string
  created_at: string
}

export type SessionType = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'
