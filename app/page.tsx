'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

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

function IconDiamond({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l10 10-10 10L2 12z" />
    </svg>
  )
}

function IconLeaf({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
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

function Parallax({ children, className = '', offset = 30 }: { children: React.ReactNode; className?: string; offset?: number }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>
}

/* ══════════════════════════════════
   DATA
   ══════════════════════════════════ */
const enfoques = [
  { icon: IconBrain, titulo: 'Neuropsicología', desc: 'El rigor de la ciencia para comprender cómo tu cerebro procesa la realidad. Identificamos los automatismos neurológicos que rigen tus conductas.' },
  { icon: IconDiamond, titulo: 'Eneagrama', desc: 'Un mapa clínico-espiritual que revela los mecanismos de defensa de tu personalidad. Hacer consciente lo inconsciente.' },
  { icon: IconLeaf, titulo: 'Constelaciones', desc: 'Un método fenomenológico que saca a la luz los lazos invisibles de tu historia familiar. Liberar lo que no te pertenece.' },
]

const serviciosList = [
  { titulo: 'Presencial', desc: 'Un espacio seguro y de absoluto cuidado en Santiago. La cercanía del encuentro cara a cara para trabajar con profundidad.' },
  { titulo: 'Online', desc: 'La misma profundidad y rigor clínico desde cualquier lugar del mundo, desde la comodidad de tu hogar.' },
]

/* ══════════════════════════════════
   PAGE
   ══════════════════════════════════ */
export default function Home() {
  return (
    <>
      {/* ═══════ 1. HERO — imagen real ═══════ */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden" style={{ background: '#f9fafb' }}>
        <HeroCanvas />
        {/* Hero image — right side */}
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

        <div className="container-page relative z-10 pt-32 md:pt-40 pb-20 md:pb-32">
          <FadeIn delay={0.1}>
            <span className="eyebrow mb-6">Psicólogo Clínico</span>
          </FadeIn>
          <FadeIn delay={0.2}>
            <h1 className="mb-6 max-w-2xl" style={{ color: '#111827' }}>
              Ciencia para comprender,<br />
              <span style={{ color: '#2563eb' }}>consciencia</span> para sanar
            </h1>
          </FadeIn>
          <FadeIn delay={0.35}>
            <p className="text-lg leading-relaxed max-w-xl mb-10" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
              Integramos neuropsicología, Eneagrama y Constelaciones Familiares
              para devolverte el volante de tu vida.
            </p>
          </FadeIn>
          <FadeIn delay={0.45}>
            <div className="flex flex-wrap gap-3">
              <Link href="/contacto" className="btn btn-primary">
                Agendar Consulta 0 <span className="btn-icon"><IconArrow /></span>
              </Link>
              <Link href="/sobre-mi" className="btn btn-outline">
                Conocer al profesional
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 2. ENFOQUES — cards minimalistas ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Enfoques</span>
            <h2>Tres caminos,<br />una integración</h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-5" stagger={0.12}>
            {enfoques.map((e) => (
              <StaggerItem key={e.titulo}>
                <motion.div className="card card-hover" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                  <div className="card-core">
                    <div className="card-icon w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: 'var(--brand-light)', color: '#2563eb' }}>
                      <e.icon />
                    </div>
                    <h3 className="mb-3">{e.titulo}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{e.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ═══════ 3. SOBRE MÍ — imagen real ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <FadeIn>
              <span className="eyebrow mb-4">Metodología</span>
              <h2 className="mb-6">Cuando la ciencia y la sabiduría se encuentran</h2>
              <div className="space-y-4 leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
                <p>
                  La neuropsicología nos da el mapa del cerebro. El Eneagrama
                  revela la estructura de la personalidad. Las Constelaciones
                  muestran las dinámicas invisibles del sistema familiar.
                </p>
                <p>
                  <strong style={{ color: '#111827' }}>El objetivo no es cambiar tu esencia,</strong> sino
                  comprender y flexibilizar los patrones mecánicos que bloquean tu bienestar.
                </p>
              </div>
              <Link href="/servicios" className="inline-flex items-center gap-2 text-sm font-semibold mt-8" style={{ color: '#2563eb' }}>
                Conoce los servicios <IconArrow />
              </Link>
            </FadeIn>

            <Parallax offset={20}>
              <FadeIn delay={0.15}>
                <div className="relative">
                  <div className="card" style={{ padding: '5px' }}>
                    <div className="overflow-hidden" style={{ borderRadius: 'calc(1.5rem - 5px)' }}>
                      <Image
                        src="/images/psicologo-1.jpeg"
                        alt="Pedro Bahamondes - Psicólogo"
                        width={500}
                        height={600}
                        className="w-full h-auto object-cover"
                        style={{ aspectRatio: '4/5' }}
                      />
                    </div>
                  </div>
                  {/* Floating accent */}
                  <motion.div
                    className="absolute -bottom-4 -left-4 px-4 py-2 rounded-2xl text-xs font-semibold shadow-lg"
                    style={{ background: '#2563eb', color: '#fff' }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    15+ años de experiencia
                  </motion.div>
                </div>
              </FadeIn>
            </Parallax>
          </div>
        </div>
      </section>

      {/* ═══════ 4. QUOTE ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page text-center max-w-2xl mx-auto">
          <FadeIn>
            <p className="text-xl md:text-2xl font-medium leading-relaxed mb-8" style={{ color: '#111827', fontFamily: 'var(--font-body)' }}>
              &ldquo;Cuando estás en modo automático, no decides tú. Decide tu
              miedo al rechazo, tu necesidad de control o la herida de tu
              infancia.&rdquo;
            </p>
            <span className="eyebrow">— Pedro Bahamondes A.</span>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 5. SERVICIOS ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <FadeIn className="max-w-2xl mb-16">
            <span className="eyebrow mb-4">Servicios</span>
            <h2>Dos modalidades</h2>
          </FadeIn>

          <Stagger className="grid md:grid-cols-2 gap-5 mb-12" stagger={0.12}>
            {serviciosList.map((s) => (
              <StaggerItem key={s.titulo}>
                <motion.div className="card card-hover" whileHover={{ y: -3 }} transition={{ duration: 0.5, ease: spring }}>
                  <div className="card-core">
                    <h3 className="mb-3">{s.titulo}</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{s.desc}</p>
                    <Link href="/contacto" className="btn btn-outline" style={{ fontSize: '0.75rem', padding: '8px 20px' }}>
                      Agendar <IconArrow />
                    </Link>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeIn delay={0.15}>
            <div className="card" style={{ padding: '5px' }}>
              <div className="card-core p-10 md:p-14 text-center" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)' }}>
                <span className="eyebrow mb-3">Sin costo — 15 min</span>
                <h3 className="mb-3 mt-3">Consulta 0</h3>
                <p className="text-sm max-w-md mx-auto mb-8" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                  Una sesión gratuita para conocernos antes de agendar tu primera sesión formal.
                </p>
                <Link href="/contacto" className="btn btn-primary">
                  Agendar Consulta 0 <span className="btn-icon"><IconArrow /></span>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ 6. CTA FINAL ═══════ */}
      <section className="section-block text-center" style={{ background: '#ffffff' }}>
        <div className="container-page max-w-xl">
          <FadeIn>
            <h2 className="mb-6">¿Listo para iniciar?</h2>
            <p className="text-base mb-10" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              Da el primer paso hacia una vida más consciente.
            </p>
            <Link href="/contacto" className="btn btn-primary" style={{ padding: '14px 36px' }}>
              Agendar mi primera consulta <span className="btn-icon"><IconArrow /></span>
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
