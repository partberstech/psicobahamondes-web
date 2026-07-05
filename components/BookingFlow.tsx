'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ───
type Modalidad = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

interface SessionType {
  id: Modalidad
  titulo: string
  duracion: string
  precio: string
  descripcion: string
  schedule: string
  icono: string
  color: string
}

const SESSION_TYPES: SessionType[] = [
  {
    id: 'sesion-cero',
    titulo: 'Sesión Cero',
    duracion: '15 min',
    precio: 'Gratuita',
    descripcion: 'Conversación breve para conocernos y resolver tus dudas. Sin compromiso.',
    schedule: 'Lun–Vie · 19:00 a 21:00',
    icono: '☕',
    color: '#2563eb',
  },
  {
    id: 'consulta-presencial',
    titulo: 'Consulta Presencial',
    duracion: '50 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión en consulta en Santiago. Trabajamos presencialmente con toda la atención.',
    schedule: 'Lun–Sáb · 09:00 a 14:00',
    icono: '📍',
    color: '#059669',
  },
  {
    id: 'consulta-telematica',
    titulo: 'Consulta Telemática',
    duracion: '50 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión online por videollamada desde cualquier lugar. Misma calidad terapéutica.',
    schedule: 'Lun–Vie · 15:00 a 18:00',
    icono: '💻',
    color: '#7c3aed',
  },
]

const CALENDAR_URLS: Record<Modalidad, string> = {
  'sesion-cero': 'https://cal.com/alejandro-rojas-verdugo-sd839u/sesion-cero?embed=true&theme=light',
  'consulta-presencial': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-presencial?embed=true&theme=light',
  'consulta-telematica': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-telematica?embed=true&theme=light',
}

type Step = 'select' | 'info' | 'calendar' | 'done'

// ─── Component ───
export default function BookingFlow() {
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<Modalidad>('sesion-cero')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const session = SESSION_TYPES.find((s) => s.id === selected)!

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Ingresa tu nombre'
    if (!form.email.trim()) e.email = 'Ingresa tu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Ingresa tu teléfono'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) setStep('calendar')
  }

  const calUrl = form.name
    ? `${CALENDAR_URLS[selected]}&name=${encodeURIComponent(form.name)}&email=${encodeURIComponent(form.email)}&guests=${encodeURIComponent(form.email)}&notes=Teléfono: ${encodeURIComponent(form.phone)}`
    : CALENDAR_URLS[selected]

  return (
    <div className="w-full max-w-[820px] mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {(['select', 'info', 'calendar'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
              style={{
                background: step === s ? '#2563eb' : ['select', 'info'].includes(step) && ['select', 'info'].indexOf(s) <= ['select', 'info'].indexOf(step) ? '#2563eb' : '#e5e7eb',
                color: step === s || (['select', 'info'].includes(step) && ['select', 'info'].indexOf(s) <= ['select', 'info'].indexOf(step)) ? '#ffffff' : '#9ca3af',
              }}
            >
              {i + 1}
            </div>
            {i < 2 && (
              <div
                className="w-8 h-[2px] rounded-full"
                style={{
                  background: (['select', 'info'].includes(step) && i < ['select', 'info'].indexOf(step)) || step === 'calendar' ? '#2563eb' : '#e5e7eb',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="text-center mb-8">
              <span className="eyebrow mb-3">Agendar Consulta</span>
              <h2 className="mb-3">¿Qué tipo de consulta necesitas?</h2>
              <p
                className="text-sm max-w-lg mx-auto"
                style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
              >
                Elegí la modalidad que mejor se adapte a tus necesidades.
                Todas las sesiones son guiadas por Pedro Bahamondes.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {SESSION_TYPES.map((s) => {
                const active = selected === s.id
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="card card-hover text-left w-full cursor-pointer"
                    style={{
                      borderColor: active ? s.color : undefined,
                      background: active ? `${s.color}08` : undefined,
                    }}
                  >
                    <div className="card-core">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 card-icon"
                        style={{
                          background: `${s.color}10`,
                        }}
                      >
                        {s.icono}
                      </div>
                      <h3
                        className="mb-1"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.125rem',
                          fontWeight: 600,
                          color: '#111827',
                        }}
                      >
                        {s.titulo}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${s.color}12`, color: s.color }}
                        >
                          {s.duracion}
                        </span>
                        <span
                          className="text-xs"
                          style={{ fontFamily: 'var(--font-body)', color: '#9ca3af' }}
                        >
                          {s.precio}
                        </span>
                      </div>
                      <p
                        className="text-xs leading-relaxed mb-3"
                        style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
                      >
                        {s.descripcion}
                      </p>
                      <div
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: s.color }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        {s.schedule}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep('info')}
                className="btn btn-brand"
              >
                Continuar
                <span className="btn-icon">→</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Selected session summary */}
              <div className="md:col-span-2">
                <div className="card" style={{ background: `${session.color}06`, borderColor: `${session.color}20` }}>
                  <div className="card-core">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ background: `${session.color}12` }}
                    >
                      {session.icono}
                    </div>
                    <h3
                      className="mb-1"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.125rem',
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {session.titulo}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: `${session.color}12`, color: session.color }}>
                        {session.duracion}
                      </span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>{session.precio}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium mb-1" style={{ color: session.color }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {session.schedule}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9ca3af' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {session.id === 'consulta-presencial' ? 'Santiago, Chile' : 'Online'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setStep('select')}
                  className="text-xs mt-3 transition-opacity hover:opacity-60"
                  style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}
                >
                  ← Cambiar modalidad
                </button>
              </div>

              {/* Form */}
              <div className="md:col-span-3">
                <h3
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: '#111827',
                  }}
                >
                  Tus datos
                </h3>
                <p
                  className="text-sm mb-6"
                  style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
                >
                  Solo lo esencial para agendar. El resto lo conversamos en la sesión.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="label block mb-1.5">Nombre completo</label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input"
                      style={{ borderColor: errors.name ? '#ef4444' : undefined }}
                    />
                    {errors.name && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label block mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input"
                      style={{ borderColor: errors.email ? '#ef4444' : undefined }}
                    />
                    {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
                  </div>
                  <div>
                    <label className="label block mb-1.5">Teléfono</label>
                    <input
                      type="tel"
                      placeholder="+56 9 XXXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input"
                      style={{ borderColor: errors.phone ? '#ef4444' : undefined }}
                    />
                    {errors.phone && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.phone}</p>}
                  </div>
                  <button
                    onClick={handleContinue}
                    className="btn btn-brand w-full py-3"
                  >
                    Elegir horario
                    <span className="btn-icon">→</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="grid md:grid-cols-5 gap-8">
              {/* Info sidebar */}
              <div className="md:col-span-2 space-y-4">
                <div className="card" style={{ background: `${session.color}06`, borderColor: `${session.color}20` }}>
                  <div className="card-core !p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${session.color}12` }}>
                        {session.icono}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#111827' }}>{session.titulo}</p>
                        <p className="text-xs" style={{ color: '#6b7280' }}>{session.duracion} · {session.precio}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: session.color }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {session.schedule}
                    </div>
                    <div className="mt-3 pt-3 divider" />
                    <div className="text-xs space-y-1 mt-3" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
                      <p><strong style={{ color: '#111827' }}>{form.name}</strong></p>
                      <p>{form.email}</p>
                      <p>{form.phone}</p>
                    </div>
                    <button
                      onClick={() => setStep('info')}
                      className="text-xs mt-2 transition-opacity hover:opacity-60"
                      style={{ color: '#2563eb', fontFamily: 'var(--font-body)' }}
                    >
                      Editar datos →
                    </button>
                  </div>
                </div>

                <div
                  className="text-xs leading-relaxed p-4 rounded-xl"
                  style={{ background: '#f9fafb', color: '#6b7280', fontFamily: 'var(--font-body)' }}
                >
                  <strong style={{ color: '#111827' }}>Importante:</strong> Los horarios
                  disponibles respetan el schedule de cada modalidad. Si no encuentras
                  un horario que te acomode, puedes contactarme directamente por
                  WhatsApp o email.
                </div>
              </div>

              {/* Calendar */}
              <div className="md:col-span-3">
                <div className="card">
                  <div className="card-core !p-0 overflow-hidden" style={{ background: '#ffffff' }}>
                    <iframe
                      src={calUrl}
                      width="100%"
                      height="650px"
                      style={{ border: 'none' }}
                      title="Agendar consulta"
                      allow="calendar"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
