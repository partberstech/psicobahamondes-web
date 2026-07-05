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
  badge: string
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
    badge: 'Conocernos',
  },
  {
    id: 'consulta-presencial',
    titulo: 'Consulta Presencial',
    duracion: '50 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión presencial en Santiago. Trabajamos juntos con toda la atención.',
    schedule: 'Lun–Sáb · 09:00 a 14:00',
    icono: '📍',
    color: '#059669',
    badge: 'Presencial',
  },
  {
    id: 'consulta-telematica',
    titulo: 'Consulta Telemática',
    duracion: '50 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión online por videollamada desde cualquier lugar.',
    schedule: 'Lun–Vie · 15:00 a 18:00',
    icono: '💻',
    color: '#7c3aed',
    badge: 'Online',
  },
]

const CALENDAR_URLS: Record<Modalidad, string> = {
  'sesion-cero': 'https://cal.com/alejandro-rojas-verdugo-sd839u/sesion-cero?embed=true&theme=light',
  'consulta-presencial': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-presencial?embed=true&theme=light',
  'consulta-telematica': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-telematica?embed=true&theme=light',
}

const MODALIDADES: Modalidad[] = ['sesion-cero', 'consulta-presencial', 'consulta-telematica']

type Step = 'select' | 'info' | 'calendar'

// ─── Helpers ───
const spring = { type: 'spring', stiffness: 400, damping: 30 }
const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
}

// ─── Component ───
export default function BookingFlow() {
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<Modalidad>('sesion-cero')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<Record<string, boolean>>({})

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

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 text-[0.9375rem] outline-none rounded-xl border transition-all duration-200 ${errors[field] ? 'border-red-400' : focused[field] ? 'border-[#2563eb]' : 'border-[rgba(0,0,0,0.07)]'} ${focused[field] ? 'shadow-[0_0_0_3px_rgba(37,99,235,0.08)]' : ''}`

  return (
    <div className="w-full max-w-[880px] mx-auto">
      {/* ═══ Progress Bar ═══ */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {(['select', 'info', 'calendar'] as Step[]).map((s, i) => {
          const idx = ['select', 'info', 'calendar'].indexOf(step)
          const done = i < idx
          const current = i === idx
          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
                style={{
                  background: done ? '#2563eb' : current ? '#2563eb' : '#f3f4f6',
                  color: done || current ? '#ffffff' : '#9ca3af',
                  boxShadow: current ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div
                  className="w-10 h-[2px] rounded-full transition-all duration-500"
                  style={{ background: done ? '#2563eb' : '#e5e7eb' }}
                />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ STEP 1: Select ═══ */}
        {step === 'select' && (
          <motion.div key="select" {...fadeSlide}>
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Agendar Consulta</span>
              <h2 className="mb-3">¿Qué tipo de consulta necesitas?</h2>
              <p
                className="text-sm max-w-md mx-auto leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
              >
                Elegí la modalidad que mejor se adapte a tus necesidades.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {SESSION_TYPES.map((s) => {
                const active = selected === s.id
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    whileHover={{ y: -4, transition: spring }}
                    whileTap={{ scale: 0.98 }}
                    className="relative text-left w-full cursor-pointer rounded-2xl transition-all duration-300"
                    style={{
                      background: active ? '#ffffff' : '#ffffff',
                      border: `1.5px solid ${active ? s.color : 'rgba(0,0,0,0.06)'}`,
                      boxShadow: active
                        ? `0 0 0 4px ${s.color}15, 0 4px 20px rgba(0,0,0,0.06)`
                        : '0 1px 3px rgba(0,0,0,0.04)',
                      padding: '24px',
                    }}
                  >
                    {/* Badge */}
                    <span
                      className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        background: active ? `${s.color}12` : '#f3f4f6',
                        color: active ? s.color : '#9ca3af',
                      }}
                    >
                      {s.badge}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-all duration-300"
                      style={{
                        background: active ? `${s.color}12` : '#f3f4f6',
                        transform: active ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {s.icono}
                    </div>

                    {/* Title */}
                    <h3
                      className="mb-1.5"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: '#111827',
                      }}
                    >
                      {s.titulo}
                    </h3>

                    {/* Duration + Price */}
                    <div className="flex items-center gap-2 mb-2.5">
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ background: `${s.color}10`, color: s.color }}
                      >
                        {s.duracion}
                      </span>
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>
                        {s.precio}
                      </span>
                    </div>

                    {/* Desc */}
                    <p
                      className="text-xs leading-relaxed mb-4"
                      style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
                    >
                      {s.descripcion}
                    </p>

                    {/* Schedule */}
                    <div
                      className="flex items-center gap-1.5 text-[11px] font-medium"
                      style={{ color: s.color }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {s.schedule}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex justify-center mt-10">
              <motion.button
                onClick={() => setStep('info')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-brand px-8 py-3.5"
              >
                Continuar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2: Info ═══ */}
        {step === 'info' && (
          <motion.div key="info" {...fadeSlide}>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              {/* Session Summary */}
              <div className="md:col-span-2">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${session.color}06, ${session.color}02)`,
                    border: `1px solid ${session.color}15`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${session.color}12` }}
                    >
                      {session.icono}
                    </div>
                    <div>
                      <h3
                        className="font-semibold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.125rem',
                          color: '#111827',
                        }}
                      >
                        {session.titulo}
                      </h3>
                      <span className="text-xs" style={{ color: session.color }}>
                        {session.duracion} · {session.precio}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs" style={{ color: session.color }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {session.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {session.id === 'consulta-presencial' ? 'Santiago, Chile' : 'Online'}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {session.duracion}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('select')}
                  className="flex items-center gap-1 text-xs mt-4 transition-opacity hover:opacity-60"
                  style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12" />
                    <polyline points="12 19 5 12 12 5" />
                  </svg>
                  Cambiar modalidad
                </button>
              </div>

              {/* Form */}
              <div className="md:col-span-3">
                <div className="mb-7">
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
                    className="text-sm"
                    style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}
                  >
                    Solo lo esencial. El resto lo conversamos en la sesión.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#374151', fontFamily: 'var(--font-body)' }}
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: María González"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused({ ...focused, name: true })}
                      onBlur={() => setFocused({ ...focused, name: false })}
                      className={inputClass('name')}
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1"
                        style={{ color: '#ef4444' }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#374151', fontFamily: 'var(--font-body)' }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused({ ...focused, email: true })}
                      onBlur={() => setFocused({ ...focused, email: false })}
                      className={inputClass('email')}
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1"
                        style={{ color: '#ef4444' }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: '#374151', fontFamily: 'var(--font-body)' }}
                    >
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      placeholder="+56 9 XXXX XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={() => setFocused({ ...focused, phone: true })}
                      onBlur={() => setFocused({ ...focused, phone: false })}
                      className={inputClass('phone')}
                      style={{ fontFamily: 'var(--font-body)' }}
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs mt-1"
                        style={{ color: '#ef4444' }}
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  <motion.button
                    onClick={handleContinue}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-brand w-full py-3.5 mt-2"
                  >
                    Elegir horario
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 3: Calendar ═══ */}
        {step === 'calendar' && (
          <motion.div key="calendar" {...fadeSlide}>
            <div className="grid md:grid-cols-5 gap-8">
              {/* Sidebar */}
              <div className="md:col-span-2 space-y-4">
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: `linear-gradient(135deg, ${session.color}06, ${session.color}02)`,
                    border: `1px solid ${session.color}15`,
                  }}
                >
                  {/* Session header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: `${session.color}12` }}
                    >
                      {session.icono}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#111827' }}>
                        {session.titulo}
                      </p>
                      <p className="text-xs" style={{ color: session.color }}>
                        {session.duracion} · {session.precio}
                      </p>
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="space-y-2.5 mb-4">
                    <div className="flex items-center gap-2 text-xs" style={{ color: session.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {session.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                      {session.id === 'consulta-presencial' ? 'Santiago, Chile' : 'Online'}
                    </div>
                  </div>

                  <div className="divider" />

                  {/* User data */}
                  <div className="mt-4 space-y-1.5">
                    <p className="text-xs font-medium" style={{ color: '#111827' }}>
                      {form.name}
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      {form.email}
                    </p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>
                      {form.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => setStep('info')}
                    className="flex items-center gap-1 text-xs mt-3 transition-opacity hover:opacity-60"
                    style={{ color: '#2563eb', fontFamily: 'var(--font-body)' }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Editar datos
                  </button>
                </div>

                {/* Schedule note */}
                <div
                  className="text-xs leading-relaxed p-4 rounded-xl flex items-start gap-3"
                  style={{
                    background: '#f9fafb',
                    color: '#6b7280',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>
                    <strong style={{ color: '#111827' }}>Horarios disponibles:</strong>{' '}
                    {session.schedule}. Si no encuentras un horario que te acomode,
                    escríbeme por WhatsApp o email.
                  </span>
                </div>
              </div>

              {/* Calendar iframe */}
              <div className="md:col-span-3">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    border: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  }}
                >
                  <iframe
                    src={calUrl}
                    width="100%"
                    height="650px"
                    style={{ border: 'none', display: 'block' }}
                    title="Agendar consulta"
                    allow="calendar"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
