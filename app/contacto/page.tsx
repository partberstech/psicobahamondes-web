'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import BookingFlow from '@/components/BookingFlow'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

const IconShield = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const IconHeart = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const IconMessageCircle = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

export default function Contacto() {
  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(400px, 55vh, 560px)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/Hero_Contacto.jpeg"
            alt="Contacto - Psicobahamondes"
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(17,24,39,0.75) 0%, rgba(17,24,39,0.45) 50%, rgba(17,24,39,0.15) 100%)',
          }} />
        </div>
        <div className="container-page relative z-10" style={{ paddingTop: 'clamp(180px, 28vh, 300px)', paddingBottom: 'clamp(80px, 12vh, 140px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl"
          >
            <span className="eyebrow mb-5" style={{ display: 'inline-flex', background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>
              Agenda tu Consulta
            </span>
            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 7vw, 5.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.035em',
                fontWeight: 800,
                color: '#ffffff',
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
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              Elegí la modalidad que prefieras — presencial en Osorno u online desde
              cualquier lugar — completá tus datos y agendá tu sesión en el horario que
              mejor te acomode. La primera consulta es gratuita y sin compromiso.
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
              { icon: <IconShield />, title: 'Confidencial', desc: 'Tus datos están protegidos bajo secreto profesional. Tu proceso terapéutico se mantiene en estricto reservo, como exige la ética psicológica.' },
              { icon: <IconHeart />, title: 'Sin compromiso', desc: 'La Sesión Cero es gratuita y dura 15 minutos. Sirve para que nos conozcamos y evalúes si mi enfoque se ajusta a lo que necesitas.' },
              { icon: <IconMessageCircle />, title: 'Acompañamiento', desc: 'Si tienes dudas antes de agendar, puedes escribirme por WhatsApp o email. Estoy aquí para orientarte sin presión.' },
            ].map((item) => (
              <motion.div key={item.title} {...fadeUp} className="card card-hover">
                <div className="card-core">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 mx-auto"
                    style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className="mb-2"
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
              No se trata de cambiar quién eres, sino de liberar quién puedes ser.
              Agenda tu Sesión Cero y descubre cómo puedo acompañarte.
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
