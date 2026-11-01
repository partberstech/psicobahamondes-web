'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPostFull } from '@/lib/notion'
import ArticleBody from '@/components/blog/ArticleBody'
import ReadingProgress from '@/components/blog/ReadingProgress'
import TableOfContents, { type TocItem } from '@/components/blog/TableOfContents'
import { formatDate } from '@/lib/format'
import { toEmbedUrl } from '@/lib/embed'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    fetch(`/api/blog/${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((d) => {
        if (cancelled) return
        setPost(d.post)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  // Metadatos dinámicos (título + imagen OG)
  useEffect(() => {
    if (!post) return
    const ogUrl = `/api/og?title=${encodeURIComponent(post.title)}&excerpt=${encodeURIComponent(post.excerpt)}&category=${encodeURIComponent(post.category)}&date=${encodeURIComponent(post.date)}`

    const existing = document.querySelector('meta[property="og:image"]')
    if (existing) existing.setAttribute('content', `${window.location.origin}${ogUrl}`)
    else {
      const meta = document.createElement('meta')
      meta.setAttribute('property', 'og:image')
      meta.setAttribute('content', `${window.location.origin}${ogUrl}`)
      document.head.appendChild(meta)
    }

    const desc = document.querySelector('meta[name="description"]')
    if (desc && post.excerpt) desc.setAttribute('content', post.excerpt)

    document.title = `${post.title} | Psicobahamondes`
  }, [post])

  const toc: TocItem[] = useMemo(() => {
    if (!post?.blocks) return []
    return post.blocks
      .filter((b) => b.type === 'heading' && b.level >= 2)
      .map((b) => {
        if (b.type !== 'heading') return null
        const text = b.rich.map((s) => s.text).join('').trim()
        return { id: b.id, text, level: b.level }
      })
      .filter((x): x is TocItem => Boolean(x && x.text))
  }, [post])

  if (loading) {
    return (
      <section
        className="section-block"
        style={{ paddingTop: 'clamp(120px, 16vh, 180px)', minHeight: '60vh' }}
      >
        <div className="container-page">
          <div className="animate-pulse" style={{ maxWidth: 760 }}>
            <div style={{ height: 12, width: 120, borderRadius: 9999, background: '#f3f4f6', marginBottom: 24 }} />
            <div style={{ height: 40, width: '92%', borderRadius: 10, background: '#f3f4f6', marginBottom: 14 }} />
            <div style={{ height: 40, width: '64%', borderRadius: 10, background: '#f3f4f6', marginBottom: 28 }} />
            <div style={{ height: 12, width: '100%', borderRadius: 6, background: '#f9fafb', marginBottom: 10 }} />
            <div style={{ height: 12, width: '88%', borderRadius: 6, background: '#f9fafb' }} />
          </div>
        </div>
      </section>
    )
  }

  if (error || !post) {
    return (
      <section
        className="section-block text-center"
        style={{ paddingTop: 'clamp(120px, 18vh, 200px)', minHeight: '60vh' }}
      >
        <motion.div {...fadeUp} className="container-page mx-auto max-w-lg">
          <p className="label mb-4" style={{ color: '#2563eb' }}>
            Error 404
          </p>
          <h1
            className="mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.875rem, 4vw, 2.75rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#111827',
            }}
          >
            Artículo no encontrado
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem', marginBottom: '2rem' }}>
            Este artículo no existe, fue despublicado o cambió de enlace.
          </p>
          <Link href="/blog" className="btn btn-primary">
            ← Volver al blog
          </Link>
        </motion.div>
      </section>
    )
  }

  const hasBlocks = Array.isArray(post.blocks) && post.blocks.length > 0

  return (
    <>
      <ReadingProgress />

      {/* ═══════ CABECERA ═══════ */}
      <header style={{ background: '#ffffff', paddingTop: 'clamp(96px, 13vh, 150px)' }}>
        <div className="container-page">
          <div style={{ maxWidth: 820 }}>
            <motion.div {...fadeUp}>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-60"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: '#9ca3af',
                  marginBottom: '2rem',
                  textDecoration: 'none',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Blog
              </Link>

              <div className="mb-6 flex flex-wrap items-center gap-3">
                {post.category && <span className="eyebrow">{post.category}</span>}
                {post.type === 'Video' && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px',
                      borderRadius: 9999,
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontFamily: 'var(--font-display)',
                      fontSize: 10,
                      letterSpacing: '0.1em',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    <span aria-hidden>▶</span> Video
                  </span>
                )}
                <span className="label" style={{ color: '#9ca3af' }}>
                  {formatDate(post.date)}
                </span>
                <span aria-hidden style={{ color: '#e5e7eb' }}>
                  |
                </span>
                <span className="label" style={{ color: '#9ca3af' }}>
                  {post.readTime} min de lectura
                </span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 4.6vw, 3.375rem)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                  color: '#111827',
                  marginBottom: '1.5rem',
                }}
              >
                {post.title}
              </h1>

              {post.excerpt && (
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(1.0625rem, 1.6vw, 1.1875rem)',
                    lineHeight: 1.65,
                    color: '#6b7280',
                    maxWidth: 680,
                    paddingBottom: 'clamp(32px, 5vh, 56px)',
                  }}
                >
                  {post.excerpt}
                </p>
              )}
            </motion.div>
          </div>
        </div>

        {/* Portada */}
        {post.cover && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="container-page"
            style={{ paddingBottom: 'clamp(8px, 2vh, 24px)' }}
          >
            <div
              style={{
                maxWidth: 1000,
                borderRadius: 24,
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.05)',
                background: '#f3f4f6',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover}
                alt={post.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════ VIDEO ═══════ */}
      {post.videoUrl && (
        <section style={{ background: '#ffffff', paddingBlock: 'clamp(24px, 4vh, 40px)' }}>
          <div className="container-page">
            <div style={{ maxWidth: 860, margin: '0 auto' }}>
              <div
                style={{
                  aspectRatio: '16 / 9',
                  overflow: 'hidden',
                  borderRadius: 20,
                  background: '#0f172a',
                }}
              >
                <iframe
                  src={toEmbedUrl(post.videoUrl)}
                  title={post.title}
                  style={{ width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ CUERPO ═══════ */}
      <section style={{ background: '#ffffff', paddingBlock: 'clamp(40px, 6vh, 72px)' }}>
        <div className="container-page">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
            <motion.article {...fadeUp} style={{ maxWidth: 720 }}>
              {hasBlocks ? (
                <ArticleBody blocks={post.blocks} />
              ) : (
                <div style={{ fontFamily: 'var(--font-body)', color: '#374151', lineHeight: 1.85 }}>
                  {(post.content || '')
                    .split('\n')
                    .filter((l) => l.trim() !== '')
                    .map((line, i) => {
                      if (line.startsWith('## ')) {
                        return (
                          <h2
                            key={i}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(1.375rem, 2.4vw, 1.75rem)',
                              fontWeight: 700,
                              color: '#111827',
                              marginTop: '2.5rem',
                              marginBottom: '0.85rem',
                              letterSpacing: '-0.02em',
                            }}
                          >
                            {line.slice(3)}
                          </h2>
                        )
                      }
                      if (line.startsWith('# ')) {
                        return (
                          <h2
                            key={i}
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontSize: 'clamp(1.5rem, 2.8vw, 1.875rem)',
                              fontWeight: 700,
                              color: '#111827',
                              marginTop: '2.5rem',
                              marginBottom: '0.85rem',
                            }}
                          >
                            {line.slice(2)}
                          </h2>
                        )
                      }
                      if (line.startsWith('> ')) {
                        return (
                          <blockquote
                            key={i}
                            style={{
                              margin: '2rem 0',
                              paddingLeft: '1.5rem',
                              borderLeft: '3px solid #2563eb',
                              fontStyle: 'italic',
                              color: '#4b5563',
                              fontSize: '1.125rem',
                            }}
                          >
                            {line.slice(2)}
                          </blockquote>
                        )
                      }
                      if (line.startsWith('- ')) {
                        return (
                          <p key={i} style={{ paddingLeft: '1.25rem', marginBottom: '0.5rem' }}>
                            <span style={{ color: '#2563eb', marginRight: 8 }}>•</span>
                            {line.slice(2)}
                          </p>
                        )
                      }
                      if (line.startsWith('---')) {
                        return (
                          <hr
                            key={i}
                            style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2.5rem 0' }}
                          />
                        )
                      }
                      return (
                        <p key={i} style={{ marginBottom: '1.5rem' }}>
                          {line}
                        </p>
                      )
                    })}
                </div>
              )}
            </motion.article>

            {toc.length >= 3 && (
              <aside className="hidden lg:block">
                <div style={{ position: 'sticky', top: 104 }}>
                  <TableOfContents items={toc} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section style={{ background: '#f9fafb', paddingBlock: 'clamp(64px, 10vh, 120px)' }}>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto text-center"
            style={{ maxWidth: 560 }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3.2vw, 2.375rem)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '0.85rem',
              }}
            >
              ¿Te gustó este artículo?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.9375rem', marginBottom: '2rem' }}>
              Agenda una sesión y trabajemos juntos en tu proceso.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/contacto" className="btn btn-primary">
                Agendar consulta →
              </Link>
              <Link href="/blog" className="btn btn-outline">
                Más artículos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
