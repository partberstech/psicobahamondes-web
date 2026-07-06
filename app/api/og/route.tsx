import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Psicobahamondes'
  const excerpt = searchParams.get('excerpt') || ''
  const category = searchParams.get('category') || ''
  const date = searchParams.get('date') || ''

  // Truncate to avoid overflow
  const truncatedTitle = title.length > 80 ? title.slice(0, 77) + '...' : title
  const truncatedExcerpt = excerpt.length > 150 ? excerpt.slice(0, 147) + '...' : excerpt

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#111827',
          padding: 60,
          fontFamily: 'Plus Jakarta Sans',
        }}
      >
        {/* Top section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Badge + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {category && (
              <span
                style={{
                  display: 'inline-flex',
                  padding: '4px 14px',
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  borderRadius: 9999,
                  background: 'rgba(37,99,235,0.12)',
                  color: '#93c5fd',
                }}
              >
                {category}
              </span>
            )}
            {date && (
              <span style={{ fontSize: 14, color: '#9ca3af', fontWeight: 500 }}>
                {date}
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              color: '#ffffff',
              margin: 0,
              maxWidth: 900,
            }}
          >
            {truncatedTitle}
          </h1>

          {/* Excerpt */}
          {truncatedExcerpt && (
            <p
              style={{
                fontSize: 22,
                color: '#9ca3af',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 720,
              }}
            >
              {truncatedExcerpt}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 28,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 9999,
                background: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🧠
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#ffffff' }}>
                Psicobahamondes
              </span>
              <span style={{ fontSize: 13, color: '#6b7280' }}>
                Pedro Bahamondes · Psicólogo
              </span>
            </div>
          </div>
          <span style={{ fontSize: 14, color: '#6366f1' }}>
            psicobahamondes.cl
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
