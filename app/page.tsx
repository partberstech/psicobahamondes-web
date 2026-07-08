'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import NewsletterForm from '@/components/NewsletterForm'

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), { ssr: false })

const spring = [0.32, 0.72, 0, 1]
const springHeavy = [0.16, 1, 0.3, 1]

/* ══════════════════════════════════
   MINIMALIST SVG ICONS
   ══════════════════════════════════ */
function IconBrain({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 4.5 2.8A4 4 0 0 1 20 8.5a4.5 4.5 0 0 1-.8 8A3.5 3.5 0 0 1 16 20H8a3.5 3.5 0 0 1-3.2-3.5 4.5 4.5 0 0 1-.8-8A4 4 0 0 1 7.5 4.8 5 5 0 0 1 12 2z" />
      <path d="M12 2v20" />
    </svg>
  )
}

function IconSparkle({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74z" />
      <path d="M5 3l.5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5z" />
    </svg>
  )
}

function IconUsers({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function IconArrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12L12 4M12 4H6M12 4v6" />
    </svg>
  )
}

function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconTest({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function IconFileText({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconCalendar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

/* ══════════════════════════════════
   ANIMATION COMPONENTS
   ══════════════════════════════════ */
function FadeIn({ children, className = '', delay = 0, y = 24 }: { children: React.ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y, filter: 'blur(6px)' }}
      transition={{ duration: 0.7, ease: springHeavy, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Stagger({ children, className = '', stagger = 0.1 }: { children: React.ReactNode; className?: string; stagger?: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: springHeavy } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ══════════════════════════════════
   DATA
   ══════════════════════════════════ */
const pasos = [
  {
    icon: IconTest,
    titulo: 'Explora tu perfil',
    desc: 'Ingresa a nuestra sección de Tests y elige el que resuene con tu momento actual (personalidad, estrés, vínculos). Te tomará solo unos minutos.',
  },
  {
    icon: IconFileText,
    titulo: 'Recibe tus resultados',
    desc: 'Obtendrás un resumen inmediato que te dará una primera radiografía de tus dinámicas mentales y emocionales.',
  },
  {
    icon: IconUsers,
    titulo: 'Analicémoslos juntos',
    desc: 'Revisamos en conjunto tus resultados en una Sesión Cero gratuita. En este espacio evaluaremos qué significan y cómo podemos trabajarlos.',
  },
]

const serviciosCards = [
  {
    titulo: 'Psicoterapia Integrativa',
    desc: 'Trabajo profundo individual. Uniendo la evidencia neuropsicológica con el autodescubrimiento.',
    href: '/servicios',
  },
  {
    titulo: 'Constelaciones Familiares',
    desc: 'Sesiones enfocadas en destrabar dinámicas inconscientes heredadas de tu sistema familiar.',
    href: '/servicios',
  },
  {
    titulo: 'Eneagrama Aplicado',
    desc: 'Descubre tu tipo de personalidad y obtén un mapa claro para salir de tus automatismos.',
    href: '/servicios',
  },
]

/* ══════════════════════════════════
   PAGE
   ══════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* ═══════ 1. HERO — La Primera Impresión ═══════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden" style={{ background: '#f9fafb' }}>
        <HeroCanvas />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="Psicobahamondes"
            fill
            className="object-cover object-center"
            style={{ opacity: 0.9 }}
            priority
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #f9fafb 0%, transparent 30%)' }} />
        </div>

        <div className="container-page relative z-10 pt-20 md:pt-40 pb-16 md:pb-32">
          <FadeIn delay={0.1}>
            <span className="eyebrow mb-6">Psicología Clínica y Terapia Sistémica</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="mb-6 max-w-3xl" style={{ color: '#111827' }}>
              Ciencia para comprender.<br />
              Consciencia para <span style={{ color: '#2563eb' }}>sanar</span>.
            </h1>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p className="text-base md:text-lg leading-relaxed max-w-xl mb-8 md:mb-10" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
              Bienvenido a un espacio terapéutico donde todo el conocimiento y precisión de la <strong style={{ color: '#111827' }}>Neuropsicología</strong> se une a la profundidad del <strong style={{ color: '#111827' }}>Eneagrama</strong> y las <strong style={{ color: '#111827' }}>Constelaciones Familiares</strong>. Descubre el origen de tus bloqueos, comprende cómo funciona tu mente y sana desde la raíz para transformar tu vida.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacto" className="btn btn-primary">
                Agendar mi Sesión Cero <span className="btn-icon"><IconArrow /></span>
              </Link>
              <Link href="/test" className="btn btn-outline">
                ¿No sabes por dónde empezar? Haz un Test
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 2. EL GANCHO — Puente Tests → Sesión Cero ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Empieza por conocerte</span>
            <h2 className="mb-6">¿Sientes que repites patrones pero no sabes por qué?</h2>
            <p className="text-base leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              El primer paso para cualquier transformación es saber dónde estamos. He preparado herramientas prácticas para ayudarte a dar esa primera mirada hacia tu interior.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12" stagger={0.12}>
            {pasos.map((p, i) => (
              <StaggerItem key={p.titulo}>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: '#2563eb', color: '#fff' }}>
                      {i + 1}
                    </div>
                    <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--brand-light)', color: '#2563eb' }}>
                      <p.icon />
                    </div>
                  </div>
                  <h3 className="mb-3">{p.titulo}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.2} className="text-center">
            <Link href="/test" className="btn btn-primary">
              Ir a la sección de Tests <span className="btn-icon"><IconArrow /></span>
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 3. PROPUESTA DE VALOR — El Concepto Central ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Metodología</span>
            <h2 className="mb-6">Un enfoque integral: Tu mente y tu historia no están separadas</h2>
            <p className="text-base leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              Para lograr un bienestar real, no basta con tratar los síntomas; necesitamos mirar al ser humano en su totalidad. Mi metodología de trabajo se sostiene en dos grandes pilares que se complementan:
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12" stagger={0.12}>
            <StaggerItem>
              <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                <div className="card-core">
                  <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--brand-light)', color: '#2563eb' }}>
                    <IconBrain />
                  </div>
                  <h3 className="mb-3">🧠 La Ciencia (Neuropsicología)</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                    Aportamos el rigor científico para entender cómo funciona tu cerebro. Evaluamos tus procesos cognitivos, tu sistema nervioso y cómo tus pensamientos estructuran tu realidad diaria. Es la base para comprender <em>el mecanismo</em> de lo que te ocurre.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                <div className="card-core">
                  <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#faf5ff', color: '#9333ea' }}>
                    <IconSparkle />
                  </div>
                  <h3 className="mb-3">🌌 La Consciencia (Eneagrama y Constelaciones)</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                    Vamos más allá de la biología para explorar tu mapa emocional y tu sistema familiar. Identificamos lealtades invisibles, heridas de la infancia y estructuras de personalidad. Es la llave para encontrar <em>el origen</em> y sanar.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          </Stagger>

          <FadeIn delay={0.2} className="text-center">
            <Link href="/sobre-mi" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#2563eb' }}>
              Conoce más sobre mi trayectoria y filosofía <IconArrow />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 4. SERVICIOS — El Menú de Ayuda ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Servicios</span>
            <h2 className="mb-4">¿Cómo puedo acompañarte en tu proceso?</h2>
            <p className="text-base leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              Distintas modalidades de trabajo, un mismo objetivo: tu bienestar integral.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-5 mb-10" stagger={0.12}>
            {serviciosCards.map((s) => (
              <StaggerItem key={s.titulo}>
                <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                  <div className="card-core flex flex-col h-full">
                    <h3 className="mb-3">{s.titulo}</h3>
                    <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                    <Link href={s.href} className="btn btn-outline self-start" style={{ fontSize: '0.75rem', padding: '8px 20px' }}>
                      Ver más <IconArrow />
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.15} className="text-center">
            <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#2563eb' }}>
              Ver el detalle de todos los servicios <IconArrow />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 5. CONTENIDOS Y RECURSOS ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Contenidos</span>
            <h2 className="mb-4">Recursos para expandir tu consciencia</h2>
            <p className="text-base leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              El proceso de sanación continúa fuera de la consulta. Explora material gratuito diseñado para acompañar tu crecimiento personal.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-5 mb-10" stagger={0.12}>
            <StaggerItem>
              <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                <div className="card-core flex flex-col h-full">
                  <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#fef2f2', color: '#dc2626' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                  <h3 className="mb-3">Videos</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                    Contenido audiovisual sobre neuropsicología, Eneagrama y bienestar emocional.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                <div className="card-core flex flex-col h-full">
                  <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                    <IconFileText />
                  </div>
                  <h3 className="mb-3">Artículos</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                    Artículos profundos que exploran las dinámicas de la mente y el sistema familiar.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div className="card card-hover h-full" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                <div className="card-core flex flex-col h-full">
                  <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#eff6ff', color: '#2563eb' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                  </div>
                  <h3 className="mb-3">Podcasts</h3>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                    Conversaciones y episodios para acompañar tu proceso de autodescubrimiento.
                  </p>
                </div>
              </motion.div>
            </StaggerItem>
          </Stagger>

          <FadeIn delay={0.15} className="text-center">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: '#2563eb' }}>
              Explorar todos los artículos, videos y podcasts <IconArrow />
            </Link>
          </FadeIn>

          <FadeIn delay={0.2} className="max-w-md mx-auto mt-12">
            <NewsletterForm />
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 6. CIERRE — Push Final a la Sesión Cero ═══════ */}
      <section className="section-block" style={{ background: 'linear-gradient(135deg, #111827 0%, #1e293b 100%)' }}>
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <FadeIn>
              <span className="eyebrow mb-4" style={{ background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>Sesión Cero</span>
              <h2 className="mb-6" style={{ color: '#ffffff' }}>Da el primer paso hacia tu bienestar, sin compromisos.</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>
                Entiendo que elegir a un profesional de la salud mental es una decisión importante y muy personal. Por eso, te invito a agendar una <strong style={{ color: '#fff' }}>Sesión Cero</strong>.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  { text: 'Es 100% gratuita — Sin costos ocultos.' },
                  { text: 'Breve y enfocada — 20 a 30 minutos, en formato online.' },
                  { text: 'Claridad desde el día uno — Revisaremos tu motivo de consulta y te explicaré cómo mi metodología puede ayudarte.' },
                  { text: 'Sin presión — Evaluaremos mutuamente si hacemos un buen equipo terapéutico.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa' }}>
                      <IconCheck />
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>{item.text}</p>
                  </div>
                ))}
              </div>
              <Link href="/contacto" className="btn btn-primary" style={{ background: '#2563eb' }}>
                Agendar mi Sesión Cero ahora <span className="btn-icon"><IconArrow /></span>
              </Link>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative">
                <div className="card" style={{ padding: '5px', background: 'rgba(255,255,255,0.05)' }}>
                  <div className="overflow-hidden" style={{ borderRadius: 'calc(1.5rem - 5px)' }}>
                    <Image
                      src="/images/hero.png"
                      alt="Pedro Bahamondes - Psicólogo"
                      width={500}
                      height={600}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: '4/5', opacity: 0.9 }}
                    />
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
