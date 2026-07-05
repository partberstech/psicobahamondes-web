export const dynamic = 'force-dynamic'

import { getDb, migrate } from '@/lib/db'

const labelMap: Record<string, string> = {
  'sesion-cero': 'Sesión Cero',
  'consulta-presencial': 'Presencial',
  'consulta-telematica': 'Telemática',
}

export default async function AdminPage() {
  await migrate()
  const db = getDb()
  const rows = await db.execute(
    'SELECT * FROM bookings ORDER BY date DESC, time DESC'
  )
  const bookings = rows.rows as any[]

  return (
    <div style={{ maxWidth: 900, margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4, color: '#111827' }}>
        📋 Reservas
      </h1>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: 24 }}>
        {bookings.length} agendamiento{bookings.length !== 1 ? 's' : ''}
      </p>

      {bookings.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>No hay reservas aún.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookings.map((b: any) => (
            <div
              key={b.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '16px 20px',
                background: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: '0.9375rem', color: '#111827' }}>{b.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: 8 }}>
                    {labelMap[b.session_type] || b.session_type}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: b.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                  color: b.status === 'confirmed' ? '#065f46' : '#92400e',
                }}>
                  {b.status === 'confirmed' ? 'Confirmada' : b.status}
                </span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#6b7280', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                <span><span style={{ color: '#9ca3af' }}>📅</span> {b.date}</span>
                <span><span style={{ color: '#9ca3af' }}>🕐</span> {b.time} hrs</span>
                <span><span style={{ color: '#9ca3af' }}>✉️</span> {b.email}</span>
                <span><span style={{ color: '#9ca3af' }}>📱</span> {b.phone}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
