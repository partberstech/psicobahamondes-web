'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import type { BlogPost } from '@/lib/notion'
import PostCard from '@/components/blog/PostCard'
import NewsletterForm from '@/components/NewsletterForm'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] as [number, number, number, number] },
}

const fadeUpDelayed = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: [0.2, 0, 0, 1] as [number, number, number, number],
    delay: Math.min(i, 6) * 0.07,
  },
})

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 22,
        border: '1px solid rgba(0,0,0,0.06)',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <div className="animate-pulse" style={{ aspectRatio: '16 / 10', background: '#f3f4f6' }} />
      <div className="animate-pulse p-6">
        <div style={{ height: 10, width: '38%', borderRadius: 9999, background: '#f3f4f6', marginBottom: 16 }} />
        <div style={{ height: 16, width: '92%', borderRadius: 6, background: '#f3f4f6', marginBottom: 9 }} />
        <div style={{ height: 16, width: '68%', borderRadius: 6, background: '#f3f4f6', marginBottom: 20 }} />
        <div style={{ height: 10, width: '100%', borderRadius: 6, background: '#f9fafb', marginBottom: 7 }} />
        <div style={{ height: 10, width: '84%', borderRadius: 6, background: '#f9fafb' }} />
      </div>
    </div>
  )
}

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
  const [error, setError] = useState(false)
  const searchParams = useSearchParams()
  const [activa, setActiva] = useState(searchParams.get('categoria') || 'Todos')
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/blog', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((d) => {
        if (cancelled) return
        setPosts(Array.isArray(d.posts) ? d.posts : [])
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
  }, [])

  const categorias = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach((p) => {
      const c = p.category || 'General'
      counts.set(c, (counts.get(c) || 0) + 1)
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [posts])

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return posts.filter((p) => {
      const matchCat = activa === 'Todos' || (p.category || 'General') === activa
      const matchBusq =
        q === '' ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      return matchCat && matchBusq
    })
  }, [posts, activa, busqueda])

  const hayFiltro = activa !== 'Todos' || busqueda.trim() !== ''
  const mostrarDestacado = !hayFiltro && filtrados.length >= 3
  const destacado = mostrarDestacado ? filtrados[0] : null
  const resto = mostrarDestacado ? filtrados.slice(1) : filtrados

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(420px, 58vh, 580px)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/Hero_Contenidos_mobile.jpg"
            alt="Contenidos - Psicobahamondes"
            fill
            priority
            sizes="100vw"
            className="object-cover md:hidden"
            style={{ objectPosition: 'center 30%' }}
          />
          <Image
            src="/images/Hero_Contenidos.jpeg"
            alt="Contenidos - Psicobahamondes"
            fill
            priority
            sizes="100vw"
            className="hidden md:block object-cover"
            style={{ objectPosition: 'center 20%' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(17,24,39,0.82) 0%, rgba(17,24,39,0.55) 50%, rgba(17,24,39,0.22) 100%)',
            }}
          />
        </div>

        <div
          className="container-page relative z-10"
          style={{
            paddingTop: 'clamp(150px, 24vh, 250px)',
            paddingBottom: 'clamp(56px, 9vh, 96px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl"
          >
            <span
              className="mb-5 inline-flex"
              style={{
                alignItems: 'center',
                padding: '5px 13px',
                borderRadius: 9999,
                background: 'rgba(37,99,235,0.18)',
                border: '1px solid rgba(147,197,253,0.35)',
                color: '#bfdbfe',
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                letterSpacing: '0.16em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Contenidos
            </span>

            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 6.5vw, 5rem)',
                lineHeight: 0.94,
                letterSpacing: '-0.04em',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              Noticias y reflexiones
            </h1>

            <p
              className="max-w-2xl"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.82)',
              }}
            >
              Artículos, videos y recursos sobre neuropsicología, Eneagrama y
              Constelaciones Familiares. Contenido diseñado para acompañar tu
              proceso de autodescubrimiento y crecimiento personal.
            </p>

            {!loading && posts.length > 0 && (
              <p
                className="mt-7"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                {posts.length} {posts.length === 1 ? 'artículo publicado' : 'artículos publicados'}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══════ SEARCH + FILTROS ═══════ */}
      {!loading && posts.length > 0 && (
        <div
          className="sticky top-0 z-30"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div className="container-page py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative w-full lg:max-w-xs">
                <div
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#9ca3af' }}
                >
                  <IconSearch />
                </div>
                <input
                  type="text"
                  placeholder="Buscar artículos…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full outline-none transition-all duration-300"
                  style={{
                    paddingLeft: 42,
                    paddingRight: 16,
                    paddingTop: 10,
                    paddingBottom: 10,
                    fontSize: '0.875rem',
                    borderRadius: 9999,
                    background: '#f9fafb',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'var(--font-body)',
                    color: '#111827',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(37,99,235,0.35)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08)'
                    e.currentTarget.style.background = '#ffffff'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.background = '#f9fafb'
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                <button
                  onClick={() => setActiva('Todos')}
                  className={activa === 'Todos' ? 'pill pill-active' : 'pill pill-default'}
                  style={{ cursor: 'pointer', border: 'none' }}
                >
                  Todos
                  <span style={{ marginLeft: 6, opacity: 0.55 }}>{posts.length}</span>
                </button>
                {categorias.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiva(cat.name)}
                    className={activa === cat.name ? 'pill pill-active' : 'pill pill-default'}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {cat.name}
                    <span style={{ marginLeft: 6, opacity: 0.55 }}>{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ ARTÍCULOS ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb', paddingBlock: 'clamp(48px, 7vh, 88px)' }}>
        <div className="container-page">
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : error ? (
            <motion.div {...fadeUp} className="mx-auto max-w-md py-16 text-center">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.75rem',
                }}
              >
                No pudimos cargar los artículos
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: '#6b7280', fontSize: '0.9375rem' }}>
                Hubo un problema de conexión. Recarga la página en unos segundos.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary mt-6"
                style={{ cursor: 'pointer' }}
              >
                Reintentar
              </button>
            </motion.div>
          ) : filtrados.length === 0 ? (
            <motion.div {...fadeUp} className="mx-auto max-w-md py-16 text-center">
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.025em',
                  fontWeight: 700,
                  color: '#111827',
                  marginBottom: '0.85rem',
                }}
              >
                {busqueda ? 'Sin resultados' : 'Próximamente'}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                {busqueda
                  ? `No encontramos artículos que coincidan con "${busqueda}". Prueba con otro término.`
                  : 'Estamos preparando contenido de valor. Muy pronto encontrarás artículos, reflexiones y recursos sobre nuestro enfoque integrativo.'}
              </p>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="btn btn-outline mt-6"
                  style={{ cursor: 'pointer' }}
                >
                  Limpiar búsqueda
                </button>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6">
              {destacado && (
                <motion.div {...fadeUp}>
                  <PostCard post={destacado} featured />
                </motion.div>
              )}

              {resto.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {resto.map((post, i) => (
                    <motion.div key={post.id} {...fadeUpDelayed(i)}>
                      <PostCard post={post} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ═══════ NEWSLETTER ═══════ */}
      <section className="section-block" style={{ background: '#111827' }}>
        <div className="container-page">
          <div className="mx-auto grid max-w-4xl items-center gap-10 md:grid-cols-2">
            <motion.div {...fadeUp}>
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                Recibe los artículos en tu correo
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                }}
              >
                Suscríbete para recibir cada nueva publicación directamente en
                tu bandeja de entrada.
              </p>
            </motion.div>
            <motion.div {...fadeUpDelayed(1)}>
              <NewsletterForm />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
