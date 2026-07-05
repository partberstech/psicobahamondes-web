'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

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

const posts = [
  {
    id: 1,
    categoria: 'Eneagrama',
    fecha: 'Junio 2026',
    titulo: '¿Qué es el Eneagrama y cómo puede ayudarte a conocerte mejor?',
    excerpt:
      'Descubre cómo esta herramienta milenaria combinada con la psicología moderna puede revelar los patrones que gobiernan tu vida.',
  },
  {
    id: 2,
    categoria: 'Neuropsicología',
    fecha: 'Mayo 2026',
    titulo: 'El piloto automático: ¿Por qué repetimos los mismos patrones?',
    excerpt:
      'Una mirada desde la neuropsicología a los mecanismos cerebrales que nos mantienen atrapados en conductas automáticas.',
  },
  {
    id: 3,
    categoria: 'Constelaciones',
    fecha: 'Abril 2026',
    titulo: 'Constelaciones Familiares: Sanar las dinámicas invisibles',
    excerpt:
      'Cómo los lazos inconscientes de tu historia familiar influyen en tus relaciones actuales y cómo liberarte de ellos.',
  },
]

const categorias = ['Todos', 'Neuropsicología', 'Eneagrama', 'Constelaciones', 'Opinión']

export default function Blog() {
  const [activa, setActiva] = useState('Todos')
  const filtrados =
    activa === 'Todos' ? posts : posts.filter((p) => p.categoria === activa)

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="section-block pt-24 md:pt-32" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-4">Blog</span>
            <h1
              className="mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: '#111827',
              }}
            >
              Noticias y reflexiones
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: '#6b7280',
              }}
            >
              Artículos, columnas de opinión y recursos sobre neuropsicología,
              Eneagrama y Constelaciones Familiares.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FILTER PILLS ═══════ */}
      <div
        className="py-6"
        style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="container-page">
          <div className="flex flex-wrap gap-3">
            {categorias.map((cat) => {
              const isActive = cat === activa
              return (
                <button
                  key={cat}
                  onClick={() => setActiva(cat)}
                  className={isActive ? 'btn btn-primary' : 'btn btn-outline'}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════ ARTICLES ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          {filtrados.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtrados.map((post, i) => (
                <motion.article key={post.id} {...fadeUpDelayed(i)}>
                  <div className="card card-hover">
                    <div className="card-core flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="eyebrow">{post.categoria}</span>
                        <span
                          className="label ml-auto"
                          style={{ color: '#9ca3af' }}
                        >
                          {post.fecha}
                        </span>
                      </div>
                      <h3
                        className="mb-3"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                          lineHeight: 1.35,
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        <Link
                          href={`/blog/${post.id}`}
                          className="hover:opacity-60 transition-opacity"
                          style={{ color: '#111827' }}
                        >
                          {post.titulo}
                        </Link>
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-6 flex-1"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: '#6b7280',
                        }}
                      >
                        {post.excerpt}
                      </p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="label inline-flex items-center gap-2"
                        style={{ color: '#2563eb' }}
                      >
                        Leer artículo <span>→</span>
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div {...fadeUp} className="text-center py-20">
              <h2
                className="mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.025em',
                  fontWeight: 700,
                  color: '#111827',
                }}
              >
                Próximamente
              </h2>
              <p
                className="text-sm max-w-md mx-auto"
                style={{
                  fontFamily: "var(--font-body)",
                  color: '#6b7280',
                }}
              >
                Estamos preparando contenido de valor. Muy pronto encontrarás
                artículos, reflexiones y recursos sobre nuestro enfoque integrativo.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ NEWSLETTER CTA ═══════ */}
      <section className="section-block text-center" style={{ background: '#111827' }}>
        <div className="container-page max-w-lg">
          <motion.div {...fadeUp}>
            <h2
              className="mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              Recibe los artículos en tu correo
            </h2>
            <p
              className="text-sm mb-8"
              style={{
                fontFamily: "var(--font-body)",
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Suscríbete para recibir cada nueva publicación directamente en tu
              bandeja de entrada.
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
              <button
                className="btn"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  borderRadius: '0 9999px 9999px 0',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  padding: '11px 24px',
                  whiteSpace: 'nowrap',
                }}
              >
                Suscribirme
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
