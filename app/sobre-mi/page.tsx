'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { SocialPost } from '@/lib/social'
import { platformMeta } from '@/lib/social'

/* ── Spring easing (design system v3) ── */
const spring = [0.32, 0.72, 0, 1]

/* ── Scroll animation variants ── */
const fadeUp = {
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: spring },
}

const fadeUpDelayed = (i: number) => ({
  initial: { opacity: 0, y: 30, filter: 'blur(8px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: spring, delay: i * 0.12 },
})

const scaleIn = {
  initial: { opacity: 0, scale: 0.95, filter: 'blur(6px)' },
  whileInView: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: spring },
}

/* ── SVG Icons (stroke-width 1.5, no fill, rounded caps) ── */
function IconGraduation({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}

function IconHands({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <rect x="4" y="11" width="16" height="11" rx="2" />
      <path d="M9 16v2M15 16v2" />
    </svg>
  )
}

function IconRefresh({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  )
}

function IconArrowRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/* ── Data ── */
const valores = [
  {
    icon: <IconGraduation />,
    titulo: 'Formación',
    desc: 'Más de 15 años de formación continua en neuropsicología clínica, Eneagrama y Constelaciones Familiares, con especialización en integración terapéutica.',
  },
  {
    icon: <IconHands />,
    titulo: 'Acompañamiento',
    desc: 'Cada proceso es único. Diseño un plan terapéutico adaptado a tus necesidades específicas, tu historia personal y tus objetivos de bienestar.',
  },
  {
    icon: <IconRefresh />,
    titulo: 'Visión',
    desc: 'La combinación de ciencia y sabiduría ancestral permite abordar todas las dimensiones del ser humano: neurológica, emocional, relacional y sistémica.',
  },
]

const timeline = [
  { year: '2008', titulo: 'Psicólogo', lugar: 'Universidad de Chile' },
  { year: '2012', titulo: 'Diplomado en Neuropsicología Clínica', lugar: 'Pontificia Universidad Católica de Chile' },
  { year: '2015', titulo: 'Formación en Eneagrama', lugar: 'Escuela de Eneagrama de Chile' },
  { year: '2018', titulo: 'Facilitador en Constelaciones Familiares', lugar: 'Formación internacional' },
  { year: '2020', titulo: 'Práctica clínica integrativa', lugar: 'Consultoría privada — Psicobahamondes' },
]

const galleryImages = [
  { src: '/images/consultorio1_sobre-mi.jpeg', alt: 'Pedro Bahamondes — espacio terapéutico', aspect: '4/5' },
  { src: '/images/consultorio2_sobre-mi.jpeg', alt: 'Pedro Bahamondes — consultorio', aspect: '3/4' },
  { src: '/images/consultorio3_sobre-mi.jpeg', alt: 'Pedro Bahamondes — detalle del espacio', aspect: '1/1' },
]

export default function SobreMi() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [socialLoading, setSocialLoading] = useState(true)

  useEffect(() => {
    fetch('/api/social')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => { setSocialPosts(d.posts); setSocialLoading(false) })
      .catch(() => setSocialLoading(false))
  }, [])

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="section-block relative overflow-hidden" style={{ minHeight: 'clamp(400px, 60vh, 600px)' }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero_sobre-mi.jpeg"
            alt="Pedro Bahamondes"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(17,24,39,0.3) 0%, transparent 50%, rgba(17,24,39,0.15) 100%)',
            }}
          />
        </div>
        <div className="container-page relative z-10" style={{ paddingTop: 'clamp(120px, 18vh, 200px)', paddingBottom: 'clamp(60px, 10vh, 120px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: spring }}
            className="max-w-2xl md:ml-auto md:text-right"
          >
            <span className="eyebrow mb-5 inline-block" style={{ background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>
              Sobre mí
            </span>
            <h1
              className="mb-4 md:mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem,7vw,5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: '#ffffff',
              }}
            >
              Pedro Bahamondes D.
            </h1>
            <p
              className="max-w-2xl"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              Psicólogo con más de 15 años de experiencia clínica, integrando
              neuropsicología, Eneagrama y Constelaciones Familiares en un enfoque
              único de acompañamiento terapéutico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ BIO — 2-COL GRID + FEATURED IMAGE ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            <motion.div {...fadeUp} className="space-y-6">
              <span className="eyebrow inline-block">Mi filosofía</span>
              <h2
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                  lineHeight: 0.95,
                  letterSpacing: '-0.025em',
                  fontWeight: 700,
                  color: 'var(--ink)',
                }}
              >
                Ciencia para comprender, consciencia para sanar
              </h2>
              <div className="space-y-4" style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--muted)' }}>
                <p>
                  He volcado mi vocación en guiar procesos terapéuticos que transforman vidas.
                  A través de un enfoque especializado y una sólida formación académica,
                  propongo un espacio diferente: un puente exacto entre la ciencia de tu
                  cerebro y las raíces de tu alma.
                </p>
                <p>
                  <strong style={{ color: 'var(--ink)' }}>El objetivo de la terapia no es cambiar tu esencia,</strong> sino
                  comprender y flexibilizar los patrones mecánicos que bloquean tu bienestar.
                  Cuando el automatismo toma el control, perdemos la capacidad de elegir.
                  Sanar es hacer consciente lo invisible y recuperar el volante de tu vida.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/servicios" className="btn btn-primary">
                  Ver servicios
                  <span className="btn-icon">
                    <IconArrowRight />
                  </span>
                </Link>
                <Link href="/contacto" className="btn btn-outline">
                  Agendar cita
                </Link>
              </div>
            </motion.div>

            {/* Featured image — Double-Bezel card */}
            <motion.div {...scaleIn}>
              <div className="card card-hover" style={{ aspectRatio: '3/4' }}>
                <div className="card-core overflow-hidden" style={{ padding: 0 }}>
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/filosofia_sobre-mi.png"
                      alt="Pedro Bahamondes — Filosofía"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ IMAGE GALLERY ═══════ */}
      <section className="section-block" style={{ background: 'var(--surface)' }}>
        <div className="container-page">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="eyebrow inline-block mb-4">Espacio</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Mi consultorio
            </h2>
            <p className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--muted)' }}>
              Un espacio diseñado para la confianza, la calma y la profundidad del encuentro terapéutico.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {galleryImages.map((img, i) => {
              const isWide = i === 0 // first image wider on mobile
              const spanDesktop = i === 0 ? 'md:col-span-2 md:row-span-2' : ''
              return (
                <motion.div
                  key={img.src}
                  {...fadeUpDelayed(i)}
                  className={`${isWide ? 'col-span-2' : ''} ${spanDesktop}`}
                >
                  <div className="card card-hover h-full overflow-hidden group">
                    <div className="card-core overflow-hidden" style={{ padding: 0, height: '100%' }}>
                      <div className="relative w-full h-full" style={{ minHeight: isWide ? 'clamp(300px, 40vh, 500px)' : 'clamp(200px, 28vh, 360px)' }}>
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ VALUES — 3 CARDS ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="eyebrow inline-block mb-4">Mi enfoque</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Cómo trabajo
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {valores.map((v, i) => (
              <motion.article key={v.titulo} {...fadeUpDelayed(i)}>
                <div className="card card-hover h-full">
                  <div className="card-core h-full">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                    >
                      {v.icon}
                    </div>
                    <h3
                      className="mb-4"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.125rem,1.8vw,1.375rem)',
                        lineHeight: 1.35,
                        fontWeight: 600,
                        color: 'var(--ink)',
                      }}
                    >
                      {v.titulo}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.9375rem',
                        lineHeight: 1.7,
                        color: 'var(--muted)',
                      }}
                    >
                      {v.desc}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TIMELINE ═══════ */}
      <section className="section-block" style={{ background: 'var(--surface)' }}>
        <div className="container-page max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12 md:mb-16">
            <span className="eyebrow inline-block mb-4">Trayectoria</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Formación y experiencia
            </h2>
          </motion.div>

          <div className="relative">
            {/* Vertical line */}
            <div
              className="absolute left-[19px] top-2 bottom-2 w-px"
              style={{ background: 'rgba(0,0,0,0.06)' }}
            />

            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: spring }}
                className="flex gap-6 items-start pb-10 relative"
              >
                {/* Dot */}
                <div
                  className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 relative z-10"
                  style={{
                    background: i === timeline.length - 1 ? 'var(--ink)' : '#ffffff',
                    border: i === timeline.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.6875rem',
                      color: i === timeline.length - 1 ? '#ffffff' : 'var(--muted)',
                    }}
                  >
                    {item.year}
                  </span>
                </div>
                {/* Content */}
                <div className="pt-1">
                  <h3
                    className="text-base mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      color: 'var(--ink)',
                    }}
                  >
                    {item.titulo}
                  </h3>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--muted)',
                    }}
                  >
                    {item.lugar}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ REDES SOCIALES ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
            <span className="eyebrow inline-block mb-4">Redes</span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: 'var(--ink)',
              }}
            >
              Actualidad
            </h2>
            <p className="mt-4" style={{ fontFamily: 'var(--font-body)', fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--muted)' }}>
              Publicaciones, videos y contenido que comparto en redes sociales.
            </p>
          </motion.div>

          {socialLoading ? (
            <div className="flex justify-center py-12" style={{ color: '#9ca3af' }}>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" opacity="0.3" />
                <path d="M22 12a10 10 0 0 1-10 10" />
              </svg>
            </div>
          ) : socialPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialPosts.map((post, i) => {
                const meta = platformMeta[post.network] || platformMeta['Twitter/X']
                return (
                  <motion.a
                    key={post.id}
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...fadeUpDelayed(i)}
                    className="card card-hover block"
                  >
                    <div className="card-core flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center"
                          style={{ background: meta.bg }}
                          dangerouslySetInnerHTML={{ __html: meta.svg }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ fontFamily: 'var(--font-display)', color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="label ml-auto" style={{ color: '#9ca3af' }}>
                          {post.date}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed flex-1"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}
                      >
                        {post.title}
                      </p>
                      <span
                        className="label inline-flex items-center gap-2 mt-4"
                        style={{ color: meta.color }}
                      >
                        Ver publicación <span>→</span>
                      </span>
                    </div>
                  </motion.a>
                )
              })}
            </div>
          ) : (
            <motion.div {...fadeUp} className="text-center py-12">
              <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#9ca3af' }}>
                Próximamente contenido en redes sociales.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="section-block text-center" style={{ background: 'var(--ink)' }}>
        <div className="container-page max-w-2xl">
          <motion.div {...fadeUp}>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem,4.5vw,3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              ¿Hablamos?
            </h2>
            <p
              className="mb-8"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              La primera conversación no tiene costo. Agenda tu Consulta 0 y
              descubre cómo puedo acompañarte en tu proceso.
            </p>
            <Link href="/contacto" className="btn btn-primary" style={{ background: '#ffffff', color: 'var(--ink)' }}>
              Agendar Consulta 0 gratuita
              <span className="btn-icon" style={{ background: 'rgba(0,0,0,0.08)' }}>
                <IconArrowRight />
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
