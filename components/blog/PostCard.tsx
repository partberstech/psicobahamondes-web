'use client'

import Link from 'next/link'
import type { BlogPost } from '@/lib/notion'
import { formatDate } from '@/lib/format'

function Cover({ post, tall }: { post: BlogPost; tall?: boolean }) {
  const initial = (post.title || 'P').trim().charAt(0).toUpperCase()

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: tall ? '16 / 11' : '16 / 10',
        background:
          'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 45%, #fdf4ff 100%)',
      }}
    >
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span
            aria-hidden
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: tall ? '7rem' : '5rem',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.05em',
              color: 'rgba(37,99,235,0.16)',
            }}
          >
            {initial}
          </span>
        </div>
      )}

      {/* Velo inferior para legibilidad de la fecha sobre la portada */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(17,24,39,0.28) 0%, rgba(17,24,39,0) 32%, rgba(17,24,39,0) 68%, rgba(17,24,39,0.30) 100%)',
        }}
      />

      <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
        {post.category && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px 11px',
              borderRadius: 9999,
              background: 'rgba(255,255,255,0.94)',
              color: '#1d4ed8',
              fontFamily: 'var(--font-display)',
              fontSize: 10,
              letterSpacing: '0.12em',
              fontWeight: 700,
              textTransform: 'uppercase',
              backdropFilter: 'blur(6px)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            {post.category}
          </span>
        )}
        {post.type === 'Video' && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 9999,
              background: 'rgba(17,24,39,0.82)',
              color: '#ffffff',
              fontFamily: 'var(--font-display)',
              fontSize: 10,
              letterSpacing: '0.1em',
              fontWeight: 700,
              textTransform: 'uppercase',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span aria-hidden>▶</span> Video
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Tarjeta de artículo.
 * `featured` la muestra en formato horizontal grande (post destacado).
 */
export default function PostCard({
  post,
  featured = false,
}: {
  post: BlogPost
  featured?: boolean
}) {
  const href = `/blog/${post.slug}`

  if (featured) {
    return (
      <Link href={href} className="group block w-full" style={{ color: 'inherit' }}>
        <article
          className="grid overflow-hidden md:grid-cols-2"
          style={{
            borderRadius: 26,
            border: '1px solid rgba(0,0,0,0.06)',
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)',
            transition: 'box-shadow 500ms cubic-bezier(0.32,0.72,0,1), transform 500ms cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          <Cover post={post} tall />
          <div className="flex flex-col justify-center p-7 md:p-10">
            <div className="mb-4 flex items-center gap-3">
              <span className="label" style={{ color: '#2563eb' }}>
                Destacado
              </span>
              <span aria-hidden style={{ color: '#e5e7eb' }}>
                |
              </span>
              <span className="label" style={{ color: '#9ca3af' }}>
                {formatDate(post.date)}
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.375rem, 2.4vw, 1.875rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '0.75rem',
              }}
            >
              {post.title}
            </h3>
            {post.excerpt && (
              <p
                className="line-clamp-3"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9875rem',
                  lineHeight: 1.7,
                  color: '#6b7280',
                  marginBottom: '1.5rem',
                }}
              >
                {post.excerpt}
              </p>
            )}
            <span
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                color: '#2563eb',
              }}
            >
              {post.type === 'Video' ? 'Ver video' : 'Leer artículo'}
              <span
                aria-hidden
                style={{ transition: 'transform 400ms cubic-bezier(0.32,0.72,0,1)' }}
                className="group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block h-full" style={{ color: 'inherit' }}>
      <article
        className="flex h-full flex-col overflow-hidden transition-all duration-500 group-hover:-translate-y-1"
        style={{
          borderRadius: 22,
          border: '1px solid rgba(0,0,0,0.06)',
          background: '#ffffff',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        }}
      >
        <Cover post={post} />
        <div className="flex flex-1 flex-col p-5 md:p-6">
          <span className="label mb-3" style={{ color: '#9ca3af' }}>
            {formatDate(post.date)}
          </span>
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.0625rem',
              lineHeight: 1.35,
              letterSpacing: '-0.015em',
              fontWeight: 700,
              color: '#111827',
              marginBottom: '0.6rem',
            }}
          >
            {post.title}
          </h3>
          <p
            className="line-clamp-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              lineHeight: 1.65,
              color: '#6b7280',
              flex: 1,
            }}
          >
            {post.excerpt}
          </p>
          <div
            className="mt-5 flex items-center justify-between pt-4"
            style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
          >
            <span
              className="inline-flex items-center gap-1.5"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#2563eb',
              }}
            >
              {post.type === 'Video' ? 'Ver video' : 'Leer artículo'}
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
            {post.videoUrl && (
              <span className="label" style={{ color: '#d1d5db' }}>
                Video
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
