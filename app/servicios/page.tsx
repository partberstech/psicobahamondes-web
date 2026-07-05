'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

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
    desc: 'Un espacio seguro, privado y de absoluto cuidado en Santiago. La cercanía del encuentro cara a cara para trabajar tu proceso con profundidad.',
    detalles: ['Sesiones de 50 minutos', 'Ambiente confidencial y acogedor', 'Enfoque personalizado'],
  },
  {
    icon: IconGlobe,
    titulo: 'Online',
    desc: 'La misma profundidad y rigor clínico desde cualquier lugar del mundo. Ideal para quienes viajan o prefieren la comodidad de su hogar.',
    detalles: ['Sesiones por videollamada', 'Desde cualquier país', 'Misma calidad terapéutica'],
  },
]

const metodologias = [
  {
    icon: IconBrain,
    titulo: 'Neuropsicología',
    desc: 'Estudiamos el funcionamiento de tu cerebro para identificar patrones automáticos desde una base neurológica. Comprender cómo tus procesos cerebrales influyen en tus emociones y conductas.',
  },
  {
    icon: IconStar,
    titulo: 'Eneagrama',
    desc: 'Un mapa clínico-espiritual para el diagnóstico de la neurosis humana. Al entender tus mecanismos de defensa, puedes hacer consciente el sufrimiento que generas y encontrar la salida.',
  },
  {
    icon: IconLeaf,
    titulo: 'Constelaciones Familiares',
    desc: 'Método fenomenológico que revela las dinámicas invisibles de tu historia familiar. Libera patrones repetitivos y reconcíliate con tu presente.',
  },
]

export default function Servicios() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="section-alt" style={{ paddingTop: 'clamp(120px, 16vh, 180px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-5" style={{ display: 'inline-flex' }}>Servicios</span>
            <h1 className="mb-6">
              Un espacio terapéutico diferente
            </h1>
            <p style={{ color: 'var(--muted)', maxWidth: '38rem', lineHeight: 1.7 }}>
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

          <div className="grid md:grid-cols-2" style={{ gap: '24px' }}>
            {modalidades.map((mod, i) => {
              const Icon = mod.icon
              return (
                <motion.article
                  key={mod.titulo}
                  {...fadeUpStagger(i)}
                  className="card card-hover card-glow"
                >
                  <div className="card-core flex flex-col">
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

          <div className="grid md:grid-cols-3" style={{ gap: '24px' }}>
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
                  </div>
                </motion.article>
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
