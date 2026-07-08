'use client'

import { motion } from 'framer-motion'
import BookingFlow from '@/components/BookingFlow'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

export default function Contacto() {
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
            <span className="eyebrow mb-4">Agenda tu Consulta</span>
            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: '#111827',
              }}
            >
              Da el primer paso
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: '#6b7280',
              }}
            >
              Elegí la modalidad que prefieras, completá tus datos y agendá
              tu sesión en el horario que mejor te acomode. Sin vueltas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ BOOKING FLOW ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <motion.div {...fadeUp}>
            <BookingFlow />
          </motion.div>
        </div>
      </section>

      {/* ═══════ INFO CARDS ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <div className="grid sm:grid-cols-3 gap-5 md:gap-6 max-w-3xl mx-auto text-center">
            {[
              { icon: '🔒', title: 'Confidencial', desc: 'Tus datos están protegidos bajo secreto profesional.' },
              { icon: '🎯', title: 'Sin compromiso', desc: 'La Sesión Cero es gratuita. Decide después si quieres continuar.' },
              { icon: '💬', title: 'Acompañamiento', desc: 'Si tienes dudas, escríbeme por WhatsApp o email antes de agendar.' },
            ].map((item) => (
              <motion.div key={item.title} {...fadeUp} className="card card-hover">
                <div className="card-core">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#111827',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA FINAL ═══════ */}
      <section className="section-block text-center" style={{ background: '#111827' }}>
        <div className="container-page max-w-2xl">
          <motion.div {...fadeUp}>
            <h2
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
                fontWeight: 700,
                color: '#ffffff',
              }}
            >
              ¿Listo para comenzar?
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-body)' }}
            >
              No se trata de cambiar quien eres, sino de liberar quien puedes ser.
            </p>
            <a
              href="mailto:contacto@psicobahamondes.cl"
              className="btn btn-outline"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: '#ffffff' }}
            >
              contacto@psicobahamondes.cl
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}
