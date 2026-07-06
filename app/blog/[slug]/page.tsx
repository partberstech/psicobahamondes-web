'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPostFull } from '@/lib/notion'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostFull | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setPost(d.post); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <section className="section-block pt-32 min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm" style={{ color: '#9ca3af' }}>
          <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" opacity="0.3" />
            <path d="M22 12a10 10 0 0 1-10 10" />
          </svg>
          Cargando artículo...
        </div>
      </section>
    )
  }

  if (error || !post) {
    return (
      <section className="section-block pt-32 min-h-[60vh] text-center">
        <motion.div {...fadeUp}>
          <h1 className="mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: '#111827' }}>
            Artículo no encontrado
          </h1>
          <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Este artículo no existe o fue eliminado.</p>
          <Link href="/blog" className="btn btn-primary">← Volver al blog</Link>
        </motion.div>
      </section>
    )
  }

  return (
    <>
      <section className="section-block pt-24 md:pt-32" style={{ background: '#f9fafb' }}>
        <div className="container-page max-w-3xl">
          <motion.div {...fadeUp}>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-xs font-medium mb-8 transition-opacity hover:opacity-60" style={{ color: '#6b7280' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Volver al blog
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="eyebrow">{post.category}</span>
              {post.type === 'Video' && (
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>🎬 Video</span>
              )}
              <span className="label ml-auto" style={{ color: '#9ca3af' }}>{post.date}</span>
            </div>

            <h1 className="mb-6" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              fontWeight: 800,
              color: '#111827',
            }}>
              {post.title}
            </h1>

            <p className="text-base leading-relaxed max-w-2xl" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              {post.excerpt}
            </p>
          </motion.div>
        </div>
      </section>

      {post.videoUrl && (
        <section className="section-block" style={{ background: '#ffffff' }}>
          <div className="container-page max-w-3xl">
            <motion.div {...fadeUp}>
              <div className="aspect-video rounded-2xl overflow-hidden" style={{ background: '#f3f4f6' }}>
                <iframe
                  src={post.videoUrl.replace('watch?v=', 'embed/')}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page max-w-3xl">
          <motion.div {...fadeUp}>
            <article className="prose prose-sm md:prose-base max-w-none" style={{
              fontFamily: 'var(--font-body)',
              color: '#374151',
              lineHeight: 1.8,
            }}>
              {post.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '0.75rem' }}>{line.slice(3)}</h2>
                if (line.startsWith('# ')) return <h1 key={i} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#111827', marginTop: '2.5rem', marginBottom: '0.75rem' }}>{line.slice(2)}</h1>
                if (line.startsWith('> ')) return <blockquote key={i} style={{ borderLeft: '3px solid #2563eb', paddingLeft: '1rem', color: '#6b7280', fontStyle: 'italic', margin: '1.5rem 0' }}>{line.slice(2)}</blockquote>
                if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1.5rem', color: '#374151' }}>{line.slice(2)}</li>
                if (line.startsWith('---')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
                if (line.trim() === '') return <br key={i} />
                return <p key={i} style={{ marginBottom: '1rem' }}>{line}</p>
              })}
            </article>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-block text-center" style={{ background: '#f9fafb' }}>
        <div className="container-page max-w-lg">
          <motion.div {...fadeUp}>
            <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 700, color: '#111827' }}>
              ¿Te gustó este artículo?
            </h2>
            <p className="text-sm mb-8" style={{ color: '#6b7280' }}>Agenda una sesión y trabajemos juntos en tu proceso.</p>
            <Link href="/contacto" className="btn btn-primary">Agendar consulta →</Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
