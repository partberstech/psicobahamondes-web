'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import CalEmbed from '@/components/CalEmbed'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

const FAQ_ITEMS = [
  {
    pregunta: '¿Qué es la Consulta 0?',
    respuesta:
      'Es una sesión gratuita de 15 minutos donde conversamos para conocernos. Resuelvo tus dudas sobre el proceso terapéutico y, si sientes que soy el profesional adecuado para ti, agendamos tu primera sesión formal. Sin compromiso.',
  },
  {
    pregunta: '¿Atiendes solo en Santiago o también online?',
    respuesta:
      'Ambas modalidades están disponibles. Puedes agendar sesiones presenciales en mi consulta en Santiago o sesiones online desde cualquier lugar del mundo a través de videollamada.',
  },
  {
    pregunta: '¿Con qué frecuencia son las sesiones?',
    respuesta:
      'Generalmente trabajamos con sesiones semanales de 50 minutos. La frecuencia puede ajustarse según tu proceso y necesidades particulares.',
  },
  {
    pregunta: '¿Cómo es el proceso de pago?',
    respuesta:
      'Aceptamos Fonasa, Isapre y Particular. Te confirmaremos los detalles según tu previsión al momento de agendar tu primera sesión.',
  },
]

export default function Contacto() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
            <span className="eyebrow mb-4">Contacto</span>
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
              Da el primer paso
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '1.0625rem',
                lineHeight: 1.7,
                color: '#6b7280',
              }}
            >
              Completá el formulario y te contactaré a la brevedad para agendar
              tu Consulta 0 gratuita. Sin compromiso.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CONTENT — 2-COL GRID ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
            {/* ─── LEFT: Form ─── */}
            <motion.div {...fadeUp} className="lg:col-span-3">
              <div className="mb-8">
                <span className="eyebrow mb-3">Consulta 0</span>
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
                  Gratuita · 15 minutos
                </h2>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: '#6b7280',
                  }}
                >
                  Sin compromiso. Una conversación breve para conocernos y
                  resolver tus dudas antes de agendar tu primera sesión formal.
                </p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                {/* Nombre + Edad */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#6b7280', fontFamily: "var(--font-body)" }}
                    >
                      Nombre completo
                    </label>
                    <input type="text" placeholder="Tu nombre" required className="input" />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#6b7280', fontFamily: "var(--font-body)" }}
                    >
                      Edad
                    </label>
                    <input
                      type="number"
                      placeholder="Tu edad"
                      min={0}
                      max={120}
                      required
                      className="input"
                    />
                  </div>
                </div>

                {/* Teléfono + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#6b7280', fontFamily: "var(--font-body)" }}
                    >
                      Teléfono
                    </label>
                    <input type="tel" placeholder="+56 9 XXXX XXXX" required className="input" />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#6b7280', fontFamily: "var(--font-body)" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      required
                      className="input"
                    />
                  </div>
                </div>

                {/* Modalidad */}
                <fieldset>
                  <legend
                    className="label mb-3"
                    style={{ color: '#6b7280' }}
                  >
                    Modalidad
                  </legend>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="modalidad"
                        value="presencial"
                        defaultChecked
                        className="w-4 h-4"
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        Presencial
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="modalidad"
                        value="online"
                        className="w-4 h-4"
                        style={{ accentColor: '#2563eb' }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        Online
                      </span>
                    </label>
                  </div>
                </fieldset>

                {/* Previsión */}
                <div>
                  <label className="label block mb-3" style={{ color: '#6b7280' }}>
                    Previsión
                  </label>
                  <div className="flex flex-wrap gap-6">
                    {['Fonasa', 'Isapre', 'Particular'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="prevision"
                          value={opt.toLowerCase()}
                          className="w-4 h-4"
                          style={{ accentColor: '#2563eb' }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                        >
                          {opt}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Área de interés */}
                <div>
                  <label className="label block mb-3" style={{ color: '#6b7280' }}>
                    Área de interés
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { label: 'Pareja', value: 'pareja' },
                      { label: 'Ansiedad', value: 'ansiedad' },
                      { label: 'Laboral', value: 'laboral' },
                      { label: 'Malestar físico', value: 'malestar-fisico' },
                    ].map((opt) => (
                      <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="area"
                          value={opt.value}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: '#2563eb' }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                        >
                          {opt.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Motivo */}
                <div>
                  <label className="label block mb-1.5" style={{ color: '#6b7280' }}>
                    ¿Qué te trae? (breve descripción)
                  </label>
                  <textarea
                    placeholder="Cuéntame en 2-3 líneas qué te gustaría trabajar..."
                    required
                    className="input"
                    style={{ minHeight: '120px', resize: 'vertical' }}
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="btn btn-primary w-full py-3">
                  Agendar mi Consulta 0
                </button>
              </form>
            </motion.div>

            {/* ─── RIGHT: Sidebar ─── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Info Card */}
              <motion.div {...fadeUp}>
                <div className="card">
                  <div className="card-core space-y-5">
                    <h3
                      className="mb-4"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                        lineHeight: 1.35,
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      Información de contacto
                    </h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:contacto@psicobahamondes.cl"
                        className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        <span
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="M22 4L12 13L2 4" />
                          </svg>
                        </span>
                        contacto@psicobahamondes.cl
                      </a>
                      <a
                        href="https://wa.me/569XXXXXXXX"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        <span
                          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="5" y="2" width="14" height="20" rx="2" />
                            <circle cx="12" cy="18" r="1" />
                          </svg>
                        </span>
                        +56 9 XXXX XXXX
                      </a>
                      <div
                        className="flex items-start gap-3 text-sm"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        <span
                          className="shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                            <circle cx="12" cy="9" r="2.5" />
                          </svg>
                        </span>
                        <span>
                          Santiago, Chile
                          <br />
                          <span className="text-xs" style={{ color: '#9ca3af' }}>
                            Dirección completa al agendar
                          </span>
                        </span>
                      </div>
                      <div
                        className="flex items-start gap-3 text-sm"
                        style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                      >
                        <span
                          className="shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: 'rgba(37,99,235,0.06)', color: '#2563eb' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </span>
                        <div>
                          <strong>Lun – Vie</strong> 10:00 – 20:00
                          <br />
                          <span className="text-xs" style={{ color: '#9ca3af' }}>
                            Sábados previa coordinación
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 divider" />
                    <a
                      href="https://wa.me/569XXXXXXXX"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline w-full text-center block"
                    >
                      Escribir por WhatsApp
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* FAQ Accordion */}
              <motion.div {...fadeUp}>
                <div className="card">
                  <div className="card-core">
                    <h3
                      className="mb-5"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 'clamp(1.125rem, 1.8vw, 1.375rem)',
                        lineHeight: 1.35,
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      Preguntas frecuentes
                    </h3>
                    <div className="space-y-2">
                      {FAQ_ITEMS.map((item, idx) => (
                        <div
                          key={item.pregunta}
                          className="rounded-lg"
                          style={{ background: '#f9fafb' }}
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="flex items-center justify-between gap-2 w-full px-4 py-3.5 text-sm font-medium text-left cursor-pointer"
                            style={{ color: '#111827', fontFamily: "var(--font-body)" }}
                          >
                            <span>{item.pregunta}</span>
                            <span
                              className="text-lg shrink-0 transition-transform duration-200"
                              style={{
                                color: '#2563eb',
                                transform: openFaq === idx ? 'rotate(180deg)' : 'rotate(0deg)',
                              }}
                            >
                              ▾
                            </span>
                          </button>
                          <AnimatePresence initial={false}>
                            {openFaq === idx && (
                              <motion.div
                                key="content"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                                className="overflow-hidden"
                              >
                                <div
                                  className="px-4 pb-4 text-sm leading-relaxed"
                                  style={{ color: '#6b7280', fontFamily: "var(--font-body)" }}
                                >
                                  {item.respuesta}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cal.com Embed */}
              <motion.div {...fadeUp}>
                <div className="card">
                  <div className="card-core">
                    <CalEmbed />
                  </div>
                </div>
              </motion.div>
            </div>
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
                fontFamily: "var(--font-display)",
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
              style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "var(--font-body)" }}
            >
              No se trata de cambiar quien eres, sino de liberar quien puedes ser.
            </p>
            <Link href="/recursos" className="btn btn-primary">
              Descubrir mi Eneagrama
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}