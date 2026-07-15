'use client'

import { Suspense, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { BlogPost } from '@/lib/notion'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

const fadeUpDelayed = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1], delay: i * 0.12 },
})

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <Blog />
    </Suspense>
  )
}

function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const [activa, setActiva] = useState(searchParams.get('categoria') || 'Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    fetch('/api/blog')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setPosts(d.posts); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const categorias = ['Todos', ...Array.from(new Set(posts.map(p => p.category)))]
  const filtrados = posts.filter(p => {
    const matchCat = activa === 'Todos' || p.category === activa
    const matchBusq = busqueda === '' ||
      p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.category.toLowerCase().includes(busqueda.toLowerCase())
    return matchCat && matchBusq
  })

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 45vh, 480px)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/Hero_Contenidos.jpeg"
            alt="Contenidos - Psicobahamondes"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 20%' }}
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(17,24,39,0.75) 0%, rgba(17,24,39,0.45) 50%, rgba(17,24,39,0.15) 100%)',
          }} />
        </div>
        <div className="container-page relative z-10" style={{ paddingTop: 'clamp(140px, 22vh, 240px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-5" style={{ display: 'inline-flex', background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>
              Contenidos
            </span>
            <h1 className="mb-6" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 7vw, 5.5rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.035em',
              fontWeight: 800,
              color: '#ffffff',
            }}>
              Noticias y reflexiones
            </h1>
            <p className="text-base md:text-lg leading-relaxed max-w-2xl" style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.8)',
            }}>
              Artículos, videos y recursos sobre neuropsicología, Eneagrama y
              Constelaciones Familiares. Contenido diseñado para acompañar tu
              proceso de autodescubrimiento y crecimiento personal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SEARCH + FILTER PILLS ═══════ */}
      {!loading && posts.length > 0 && (
        <div className="py-6" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="container-page">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Search bar */}
              <div className="relative flex-1 w-full sm:max-w-xs">
                <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9ca3af' }}>
                  <IconSearch />
                </div>
                <input
                  type="text"
                  placeholder="Buscar artículos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-full outline-none transition-all duration-300"
                  style={{
                    background: '#f9fafb',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'var(--font-body)',
                    color: '#111827',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.3)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              {/* Category pills */}
              <div className="flex flex-wrap gap-3">
                {categorias.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiva(cat)}
                    className={cat === activa ? 'btn btn-primary' : 'btn btn-outline'}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ ARTICLES ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20" style={{ color: '#9ca3af' }}>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" opacity="0.3" />
                <path d="M22 12a10 10 0 0 1-10 10" />
              </svg>
              <span className="text-sm">Cargando artículos...</span>
            </div>
          ) : filtrados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((post, i) => (
                <motion.article key={post.id} {...fadeUpDelayed(i)}>
                  <div className="card card-hover">
                    <div className="card-core flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="eyebrow">{post.category}</span>
                        {post.type === 'Video' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: '#fef2f2', color: '#dc2626' }}>🎬</span>
                        )}
                        <span className="label ml-auto" style={{ color: '#9ca3af' }}>
                          {post.date}
                        </span>
                      </div>
                      <h3 className="mb-3" style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                        lineHeight: 1.35,
                        fontWeight: 600,
                        color: '#111827',
                      }}>
                        <Link href={`/blog/${post.slug}`} className="hover:opacity-60 transition-opacity" style={{ color: '#111827' }}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-sm leading-relaxed mb-6 flex-1" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                        {post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`} className="label inline-flex items-center gap-2" style={{ color: '#2563eb' }}>
                        {post.type === 'Video' ? 'Ver video' : 'Leer artículo'} <span>→</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div {...fadeUp} className="text-center py-20">
              <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 0.95, letterSpacing: '-0.025em', fontWeight: 700, color: '#111827' }}>
                {busqueda ? 'Sin resultados' : 'Próximamente'}
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                {busqueda
                  ? `No encontramos artículos que coincidan con "${busqueda}". Intenta con otro término.`
                  : 'Estamos preparando contenido de valor. Muy pronto encontrarás artículos, reflexiones y recursos sobre nuestro enfoque integrativo.'
                }
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ NEWSLETTER CTA ═══════ */}
      <section className="section-block text-center" style={{ background: '#111827' }}>
        <div className="container-page max-w-lg">
          <motion.div {...fadeUp}>
            <h2 className="mb-4" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.025em',
              fontWeight: 700,
              color: '#ffffff',
            }}>
              Recibe los artículos en tu correo
            </h2>
            <p className="text-sm mb-8" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.6)' }}>
              Suscríbete para recibir cada nueva publicación directamente en tu bandeja de entrada.
            </p>
            <div className="flex max-w-sm mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="input"
                style={{
                  borderRadius: '9999px 0 0 9999px',
                  background: '#ffffff',
                  color: '#111827',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRight: 'none',
                }}
              />
              <button className="btn" style={{
                background: '#2563eb',
                color: '#ffffff',
                borderRadius: '0 9999px 9999px 0',
                fontSize: '0.8125rem',
                fontWeight: 600,
                padding: '11px 24px',
                whiteSpace: 'nowrap',
              }}>
                Suscribirme
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
