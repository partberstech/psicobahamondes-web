'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

const spring = [0.32, 0.72, 0, 1] as const

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: spring },
}

const fadeUpStagger = (i: number) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, ease: spring, delay: i * 0.1 },
})

/* ── SVG Icons ── */
const IconLocation = () => (
  <svg className="card-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

const IconGlobe = () => (
  <svg className="card-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
  </svg>
)

const IconBrain = () => (
  <svg className="card-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4 4 0 0 0-4 4v1a3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3v1a4 4 0 0 0 8 0v-1a3 3 0 0 0 3-3 3 3 0 0 0 0-6 3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z" />
    <path d="M12 2v20" />
  </svg>
)

const IconStar = () => (
  <svg className="card-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l2.09 6.26L20.18 9l-5.09 3.74L16.18 19 12 15.77 7.82 19l1.09-6.26L3.82 9l6.09-.74z" />
  </svg>
)

const IconLeaf = () => (
  <svg className="card-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="var(--brand-light)" stroke="var(--brand)" strokeWidth="1.5" />
    <path d="M8 12l3 3 5-6" stroke="var(--brand)" strokeWidth="2" />
  </svg>
)

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

const modalidades = [
  {
    icon: IconLocation,
    titulo: 'Presencial',
    desc: 'Un espacio seguro, privado y de absoluto cuidado en Santiago. La cercanía del encuentro cara a cara permite trabajar tu proceso con la profundidad y la calidez que solo la presencia puede ofrecer.',
    detalles: ['Sesiones de 50 minutos', 'Consultorio en Santiago — ambiente confidencial y acogedor', 'Enfoque integrativo personalizado', 'Agenda flexible: mañanas y tardes'],
    image: '/images/cardpresencial_servicios.jpeg',
  },
  {
    icon: IconGlobe,
    titulo: 'Online',
    desc: 'La misma profundidad y rigor clínico desde cualquier lugar del mundo. Ideal para quienes viajan, viven fuera de Santiago o prefieren la comodidad de su hogar sin sacrificar calidad terapéutica.',
    detalles: ['Sesiones por videollamada segura', 'Desde cualquier país de habla hispana', 'Misma calidad clínica que presencial', 'Horarios adaptados a tu zona horaria'],
    image: '/images/cardonline_servicios.jpeg',
  },
]

const metodologias = [
  {
    icon: IconBrain,
    titulo: 'Neuropsicología',
    desc: 'Estudiamos el funcionamiento de tu cerebro para identificar patrones automáticos desde una base neurológica. Evaluamos tus procesos cognitivos — memoria, atención, funciones ejecutivas — para comprender cómo tu sistema nervioso influye en tus emociones, conductas y en la forma en que interpretas la realidad.',
    categoria: 'Neuropsicología',
    testButton: false,
  },
  {
    icon: IconStar,
    titulo: 'Eneagrama',
    desc: 'Un mapa clínico-espiritual para el diagnóstico de la neurosis humana. A través del test RETH (Riso-Hudson), identificamos tu tipo de personalidad y tus mecanismos de defensa, permitiéndote hacer consciente el sufrimiento que generas y encontrar la salida.',
    categoria: 'Eneagrama',
    testButton: true,
  },
  {
    icon: IconLeaf,
    titulo: 'Constelaciones Familiares',
    desc: 'Método fenomenológico que revela las dinámicas invisibles de tu historia familiar. A través de la representación espacial, identificamos lealtades inconscientes, exclusiones y rupturas en el sistema familiar que se repiten en tu vida actual.',
    categoria: 'Constelaciones Familiares',
    testButton: false,
  },
]

const faqs = [
  {
    q: '¿Cuánto dura una sesión?',
    r: '50 minutos aproximadamente. La primera sesión (Consulta 0) es de 15 minutos, sin costo y sin compromiso, para que podamos conocernos.',
  },
  {
    q: '¿Cómo sé si necesito terapia presencial u online?',
    r: 'Ambas modalidades ofrecen la misma profundidad terapéutica. Si estás en Santiago y prefieres el encuentro cara a cara, el espacio presencial es ideal. Si viajas frecuentemente o prefieres la comodidad de tu hogar, la modalidad online mantiene la misma calidad clínica.',
  },
  {
    q: '¿Aceptas seguros médicos?',
    r: 'Trabajo de forma particular. Al finalizar cada sesión entregaré la boleta correspondiente para que puedas solicitar el reembolso a tu aseguradora según tu plan de salud.',
  },
  {
    q: '¿Cuál es el valor de la sesión?',
    r: 'El valor de la sesión es de $40.000 (presencial y online). La Consulta 0 de 15 minutos es completamente gratuita.',
  },
  {
    q: '¿Cómo funciona la modalidad online?',
    r: 'Agendas tu sesión, te envío el link de videollamada por correo o WhatsApp, y nos conectamos a la hora acordada. Solo necesitas una conexión estable a internet y un espacio tranquilo.',
  },
  {
    q: '¿Cuántas sesiones necesito?',
    r: 'Cada proceso es único. Algunas personas encuentran avances significativos en pocas sesiones; otras prefieren un acompañamiento más extendido. Lo conversaremos en tu Consulta 0 y ajustaremos el plan según tus necesidades.',
  },
]

export default function Servicios() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(400px, 55vh, 560px)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/hero_servicios.jpeg"
            alt="Servicios psicológicos"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(17,24,39,0.8) 0%, rgba(17,24,39,0.5) 50%, rgba(17,24,39,0.2) 100%)',
          }} />
        </div>
        <div className="container-page relative z-10" style={{ paddingTop: 'clamp(180px, 28vh, 300px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-5" style={{ display: 'inline-flex', background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>Servicios</span>
            <h1 className="mb-4 md:mb-6" style={{ color: '#ffffff' }}>
              Un espacio terapéutico diferente
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '38rem', lineHeight: 1.7 }}>
              Dos modalidades adaptadas a tu ritmo y estilo de vida, con un
              enfoque integrativo único que combina neuropsicología, Eneagrama
              y Constelaciones Familiares.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ MODALIDADES ═══════ */}
      <section className="section-block">
        <div className="container-page">
          <motion.div {...fadeUp} className="max-w-2xl" style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <span className="eyebrow mb-5" style={{ display: 'inline-flex' }}>Modalidades</span>
            <h2 className="mb-4">
              ¿Presencial u Online?
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
              Ambas modalidades ofrecen la misma profundidad terapéutica.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2" style={{ gap: 'clamp(16px, 3vw, 24px)' }}>
            {modalidades.map((mod, i) => {
              const Icon = mod.icon
              return (
                <motion.article
                  key={mod.titulo}
                  {...fadeUpStagger(i)}
                  className="card card-hover card-glow"
                >
                  <div className="card-core flex flex-col">
                    {/* Card image */}
                    <div className="relative w-full" style={{ aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
                      <Image
                        src={mod.image}
                        alt={mod.titulo}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--brand-light)',
                        color: 'var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}
                    >
                      <Icon />
                    </div>
                    <h3 className="mb-3">{mod.titulo}</h3>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 24 }} className="text-sm leading-relaxed">
                      {mod.desc}
                    </p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                      {mod.detalles.map((d) => (
                        <li key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink-soft)', fontSize: '0.9375rem' }}>
                          <IconCheck />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <Link href="/contacto" className="btn btn-primary self-start">
                      Agendar {mod.titulo.toLowerCase()}
                      <IconArrow />
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CONSULTA 0 ═══════ */}
      <section className="section-block section-alt">
        <div className="container-page" style={{ maxWidth: 640, marginInline: 'auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <span className="eyebrow mb-5" style={{ display: 'inline-flex', background: 'var(--brand-light)', color: 'var(--brand)' }}>
              Sin costo — 15 min
            </span>
            <h2 className="mb-5">
              Consulta 0: Da el primer paso sin compromiso
            </h2>
            <p style={{ color: 'var(--muted)', maxWidth: '36rem', marginInline: 'auto', lineHeight: 1.7, marginBottom: 32 }}>
              Una sesión de 15 minutos, gratuita, para conocernos antes de
              agendar tu primera sesión formal. Completa el formulario y te
              contactaré a la brevedad.
            </p>
            <Link href="/contacto" className="btn btn-primary">
              Agendar mi Consulta 0
              <IconArrow />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════ METODOLOGÍAS ═══════ */}
      <section className="section-block">
        <div className="container-page">
          <motion.div {...fadeUp} className="max-w-2xl" style={{ marginBottom: 'clamp(40px, 5vw, 64px)' }}>
            <span className="eyebrow mb-5" style={{ display: 'inline-flex' }}>Metodologías</span>
            <h2 className="mb-4">
              Nuestras herramientas terapéuticas
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3" style={{ gap: 'clamp(16px, 3vw, 24px)' }}>
            {metodologias.map((m, i) => {
              const Icon = m.icon
              return (
                <motion.article
                  key={m.titulo}
                  {...fadeUpStagger(i)}
                  className="card card-hover card-glow"
                >
                  <div className="card-core">
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: 'var(--brand-light)',
                        color: 'var(--brand)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 20,
                      }}
                    >
                      <Icon />
                    </div>
                    <h3 className="mb-3">{m.titulo}</h3>
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>{m.desc}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-5">
                      <Link
                        href={`/blog?categoria=${encodeURIComponent(m.categoria)}`}
                        className="btn btn-primary text-sm self-start"
                      >
                        Saber más
                        <IconArrow />
                      </Link>
                      {m.testButton && (
                        <Link
                          href="/test"
                          className="btn btn-outline text-sm self-start"
                        >
                          Hacer test
                          <IconArrow />
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-12">
            <span className="eyebrow inline-block mb-4">FAQ</span>
            <h2 className="mb-4">
              Preguntas frecuentes
            </h2>
            <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>Respuestas a las dudas más comunes sobre el proceso terapéutico.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: spring }}
                  className="card card-hover overflow-hidden"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                >
                  <div className="card-core" style={{ padding: 'clamp(16px, 2vw, 24px)' }}>
                    <div className="flex items-center justify-between gap-4">
                      <h3
                        className="text-base font-semibold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', lineHeight: 1.4 }}
                      >
                        {faq.q}
                      </h3>
                      <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: spring }}
                        className="shrink-0"
                        style={{ color: 'var(--brand)', width: 20, height: 20 }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </motion.div>
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: spring }}
                      className="overflow-hidden"
                    >
                      <p
                        className="mt-4 text-sm leading-relaxed"
                        style={{ fontFamily: 'var(--font-body)', color: 'var(--muted)' }}
                      >
                        {faq.r}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="section-block section-dark">
        <div className="container-page" style={{ maxWidth: 640, marginInline: 'auto', textAlign: 'center' }}>
          <motion.div {...fadeUp}>
            <h2 className="mb-4">
              Comienza tu proceso hoy
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 32, lineHeight: 1.7 }}>
              Agenda tu Consulta 0 gratuita y descubre cómo este enfoque
              integrativo puede transformar tu vida.
            </p>
            <Link
              href="/contacto"
              className="btn"
              style={{
                background: '#FFFFFF',
                color: 'var(--ink)',
              }}
            >
              Agendar ahora
              <IconArrow />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
