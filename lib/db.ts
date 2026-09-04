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
      reminder_sent_at TEXT,
      event_id TEXT,
      meet_link TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  for (const col of ['reminder_sent_at', 'event_id', 'meet_link']) {
    try { await db.execute(`ALTER TABLE bookings ADD COLUMN ${col} TEXT`) } catch { /* column already exists */ }
  }
  // Reconcile legacy double-bookings: keep only the first confirmed booking per
  // (date, session_type, time) and cancel the rest, so the unique index below
  // can be created. Idempotent — no-ops once the data is clean.
  try {
    await db.execute(`
      UPDATE bookings
      SET status = 'cancelled'
      WHERE status = 'confirmed'
        AND id NOT IN (
          SELECT id FROM (
            SELECT id, ROW_NUMBER() OVER (
              PARTITION BY date, session_type, time ORDER BY rowid
            ) AS rn
            FROM bookings
            WHERE status = 'confirmed'
          ) WHERE rn = 1
        )
    `)
  } catch (e) {
    console.warn('[db] slot dedupe skipped:', (e as Error)?.message)
  }
  // Prevent double-booking the same slot from concurrent requests
  try {
    await db.execute(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot
      ON bookings(date, session_type, time) WHERE status = 'confirmed'
    `)
  } catch (e) {
    console.warn('[db] slot unique index not created:', (e as Error)?.message)
  }
  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      source TEXT NOT NULL DEFAULT 'booking',
      booking_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `)
  await db.execute(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email)
  `)
}

export async function saveContact(opts: {
  name: string; email: string; phone: string; source?: string; bookingId?: string
}): Promise<boolean> {
  if (!tursoUrl()) return false
  try {
    const db = getDb()
    await migrate()
    // Upsert: update name/phone if contact already exists by email
    await db.execute({
      sql: `INSERT INTO contacts (name, email, phone, source, booking_id)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(email) DO UPDATE SET
              name = excluded.name,
              phone = excluded.phone,
              source = excluded.source,
              booking_id = COALESCE(excluded.booking_id, contacts.booking_id)`,
      args: [opts.name, opts.email, opts.phone, opts.source || 'booking', opts.bookingId || null],
    })
    return true
  } catch (e) {
    console.error('[db] saveContact error:', e)
    return false
  }
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
  reminder_sent_at?: string | null
  event_id?: string | null
  meet_link?: string | null
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
