'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BookingCalendar from './BookingCalendar'

type Modalidad = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'
type Step = 'select' | 'data' | 'calendar' | 'confirm'

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
    duracion: '45 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión presencial en Osorno. Trabajamos juntos con toda la atención.',
    schedule: 'Lun–Sáb · 09:00 a 14:00',
    icono: '📍',
    color: '#059669',
    badge: 'Presencial',
  },
  {
    id: 'consulta-telematica',
    titulo: 'Consulta Telemática',
    duracion: '45 min',
    precio: 'Fonasa · Isapre · Particular',
    descripcion: 'Sesión online por videollamada desde cualquier lugar.',
    schedule: 'Lun–Vie · 15:00 a 18:00',
    icono: '💻',
    color: '#7c3aed',
    badge: 'Online',
  },
]

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
}

function formatDateHuman(dateStr: string) {
  const dt = new Date(`${dateStr}T12:00:00`)
  return dt.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BookingFlow() {
  const [step, setStep] = useState<Step>('select')
  const [selected, setSelected] = useState<Modalidad>('sesion-cero')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [form, setForm] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem('eneagrama_test_data')
        if (raw) {
          const data = JSON.parse(raw)
          if (data.nombre || data.email || data.telefono) {
            return {
              name: data.nombre || '',
              email: data.email || '',
              phone: data.telefono || '',
            }
          }
        }
      } catch { /* ignore */ }
    }
    return { name: '', email: '', phone: '' }
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [focused, setFocused] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [reportSent, setReportSent] = useState<boolean | null>(null)
  const [submitError, setSubmitError] = useState('')

  const session = SESSION_TYPES.find((s) => s.id === selected)!

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Ingresa tu nombre'
    if (!form.email.trim()) e.email = 'Ingresa tu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Ingresa tu teléfono'
    else if (!/^(\+?56)?9\d{8}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Teléfono inválido — debe ser un número chileno (+569XXXXXXXX)'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) setStep('calendar')
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3.5 text-[0.9375rem] outline-none rounded-xl border transition-all duration-200 ${
      errors[field]
        ? 'border-red-400'
        : focused[field]
          ? 'border-[#2563eb]'
          : 'border-[rgba(0,0,0,0.07)]'
    } ${focused[field] ? 'shadow-[0_0_0_3px_rgba(37,99,235,0.08)]' : ''}`

  const handleFinalConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      setSubmitError('Falta seleccionar fecha y horario.')
      return
    }
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const body: Record<string, any> = {
        sessionType: selected,
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: selectedDate,
        time: selectedTime,
      }

      if (typeof window !== 'undefined') {
        try {
          const raw = sessionStorage.getItem('eneagrama_test_data')
          if (raw) {
            const data = JSON.parse(raw)
            body.eneagramaData = {
              nombre: data.nombre,
              email: data.email,
              telefono: data.telefono || '',
              scores: data.scores,
              tipoPredominante: data.tipoPredominante,
              ala: data.ala,
              centro: data.centro,
              reportSent: data.reportSent === true,
              timestamp: new Date().toISOString(),
            }
          }
        } catch { /* ignore */ }
      }

      const carriedReport = !!body.eneagramaData

      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await resp.json()

      if (!resp.ok) {
        setSubmitError(data.error || 'Error al agendar')
        return
      }

      // Only show the report-status panel when this booking carried test data
      setReportSent(carriedReport ? data.reportSent === true : null)
      setDone(true)
    } catch {
      setSubmitError('Error de conexión. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    const [y, m, d] = selectedDate.split('-')
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="text-center py-12"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${session.color}12` }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={session.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 style={{ color: '#111827', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }} className="mb-2">
          ¡Consulta agendada!
        </h2>
        <p style={{ color: '#6b7280' }} className="mb-2">
          {d}/{m}/{y} a las {selectedTime} hrs
        </p>

        {reportSent !== null && (
          <div className="mb-6 p-4 rounded-xl mt-6 max-w-xl mx-auto text-left" style={{
            background: reportSent ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${reportSent ? '#86efac' : '#fca5a5'}`,
          }}>
            {reportSent ? (
              <div>
                <p style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 600 }} className="mb-1">
                  ✅ Reporte enviado correctamente
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                  Recibirás tu reporte de Eneagrama en tu correo y el psicólogo lo tendrá listo para tu sesión.
                </p>
              </div>
            ) : (
              <div>
                <p style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: 600 }} className="mb-1">
                  Reporte no enviado
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                  No pudimos enviar el reporte automáticamente. No te preocupes, puedes compartir tus resultados en la sesión.
                </p>
              </div>
            )}
          </div>
        )}

        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }} className="mb-8 max-w-sm mx-auto leading-relaxed">
          Te enviamos un correo con los detalles y las instrucciones. Si no lo encuentras, revisa tu bandeja de spam.
        </p>
        <a
          href="/"
          className="btn btn-brand px-6 py-3 inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Volver al inicio
        </a>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-[880px] mx-auto">
      <div className="flex items-center justify-center gap-3 mb-8 md:mb-12">
        {([
          { key: 'select', label: 'Tipo' },
          { key: 'data', label: 'Datos' },
          { key: 'calendar', label: 'Fecha' },
          { key: 'confirm', label: 'Confirmar' },
        ] as { key: Step; label: string }[]).map((s, i) => {
          const steps: Step[] = ['select', 'data', 'calendar', 'confirm']
          const idx = steps.indexOf(step)
          const doneStep = i < idx
          const current = i === idx
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500"
                style={{
                  background: doneStep || current ? '#2563eb' : '#f3f4f6',
                  color: doneStep || current ? '#ffffff' : '#9ca3af',
                  boxShadow: current ? '0 0 0 4px rgba(37,99,235,0.15)' : 'none',
                }}
              >
                {doneStep ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className="text-xs font-medium hidden sm:inline" style={{ color: current ? '#111827' : '#9ca3af' }}>
                {s.label}
              </span>
              {i < 3 && (
                <div
                  className="w-10 h-[2px] rounded-full transition-all duration-500"
                  style={{ background: doneStep ? '#2563eb' : '#e5e7eb' }}
                />
              )}
            </div>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {step === 'select' && (
          <motion.div key="select" {...fadeSlide}>
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Agendar Consulta</span>
              <h2 className="mb-3">¿Qué tipo de consulta necesitas?</h2>
              <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                Elegí la modalidad que mejor se adapte a tus necesidades.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {SESSION_TYPES.map((s) => {
                const active = selected === s.id
                return (
                  <motion.button
                    key={s.id}
                    onClick={() => setSelected(s.id)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative text-left w-full cursor-pointer rounded-2xl transition-all duration-300"
                    style={{
                      background: '#ffffff',
                      border: `1.5px solid ${active ? s.color : 'rgba(0,0,0,0.06)'}`,
                      boxShadow: active
                        ? `0 0 0 4px ${s.color}15, 0 4px 20px rgba(0,0,0,0.06)`
                        : '0 1px 3px rgba(0,0,0,0.04)',
                      padding: '24px',
                    }}
                  >
                    <span
                      className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: active ? `${s.color}12` : '#f3f4f6', color: active ? s.color : '#9ca3af' }}
                    >
                      {s.badge}
                    </span>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                      style={{ background: active ? `${s.color}12` : '#f3f4f6' }}
                    >
                      {s.icono}
                    </div>
                    <h3 className="mb-1.5" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 600, color: '#111827' }}>
                      {s.titulo}
                    </h3>
                    <div className="flex items-center gap-2 mb-2.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md" style={{ background: `${s.color}10`, color: s.color }}>
                        {s.duracion}
                      </span>
                      <span className="text-[11px]" style={{ color: '#9ca3af' }}>{s.precio}</span>
                    </div>
                    <p className="text-xs leading-relaxed mb-4" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                      {s.descripcion}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: s.color }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      {s.schedule}
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="flex justify-center mt-10">
              <motion.button
                onClick={() => setStep('data')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-brand px-8 py-3.5"
              >
                Continuar
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'data' && (
          <motion.div key="data" {...fadeSlide}>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${session.color}06, ${session.color}02)`,
                    border: `1px solid ${session.color}15`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${session.color}12` }}>
                      {session.icono}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                        {session.titulo}
                      </h3>
                      <span className="text-xs" style={{ color: session.color }}>{session.duracion} · {session.precio}</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs" style={{ color: session.color }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {session.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                      {session.id === 'consulta-presencial' ? 'Edificio Plaza Bühler, 6to piso, Osorno' : 'Online'}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {session.duracion}
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep('select')} className="flex items-center gap-1 text-xs mt-4 transition-opacity hover:opacity-60" style={{ color: '#6b7280' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Cambiar modalidad
                </button>
              </div>

              <div className="md:col-span-3">
                <div className="mb-7">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#111827' }} className="mb-1">
                    Tus datos
                  </h3>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                    Solo lo esencial. El resto lo conversamos en la sesión.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Nombre completo</label>
                    <input type="text" placeholder="Ej: María González" value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      onFocus={() => setFocused({ ...focused, name: true })}
                      onBlur={() => setFocused({ ...focused, name: false })}
                      className={inputClass('name')}
                    />
                    {errors.name && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.name}</motion.p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Email</label>
                    <input type="email" placeholder="tu@email.com" value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      onFocus={() => setFocused({ ...focused, email: true })}
                      onBlur={() => setFocused({ ...focused, email: false })}
                      className={inputClass('email')}
                    />
                    {errors.email && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</motion.p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Teléfono</label>
                    <input type="tel" placeholder="+569****9313" value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      onFocus={() => setFocused({ ...focused, phone: true })}
                      onBlur={() => setFocused({ ...focused, phone: false })}
                      className={inputClass('phone')}
                    />
                    {errors.phone && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.phone}</motion.p>}
                  </div>
                  <motion.button
                    onClick={handleContinue}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-brand w-full py-3.5 mt-2"
                  >
                    Elegir horario
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'calendar' && (
          <motion.div key="calendar" {...fadeSlide}>
            <BookingCalendar
              sessionType={session.id}
              sessionColor={session.color}
              onSelect={(date, time) => {
                setSelectedDate(date)
                setSelectedTime(time)
                setSubmitError('')
                setStep('confirm')
              }}
              onBack={() => setStep('data')}
              userData={form}
            />
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" {...fadeSlide}>
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2 space-y-4">
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, ${session.color}06, ${session.color}02)`,
                    border: `1px solid ${session.color}15`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${session.color}12` }}>
                      {session.icono}
                    </div>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, color: '#111827' }}>
                        Revisa tu reserva
                      </h3>
                      <span className="text-xs" style={{ color: session.color }}>Paso final</span>
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {session.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                      {session.id === 'consulta-presencial' ? 'Edificio Plaza Bühler, 6to piso, Osorno' : 'Online'}
                    </div>
                  </div>
                </div>

                <button onClick={() => setStep('calendar')} className="flex items-center gap-1 text-xs transition-opacity hover:opacity-60" style={{ color: '#6b7280' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
                  Cambiar fecha u horario
                </button>
              </div>

              <div className="md:col-span-3">
                <div className="mb-7">
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 600, color: '#111827' }} className="mb-1">
                    Confirma tus datos
                  </h3>
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: '#6b7280' }}>
                    Al confirmar, enviaremos el correo con instrucciones, calendario y enlace de videollamada si corresponde.
                  </p>
                </div>

                <div className="rounded-2xl border p-6" style={{ borderColor: 'rgba(0,0,0,0.06)', background: '#fff' }}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Nombre</p>
                      <p className="text-sm font-medium text-gray-900">{form.name}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900">{form.email}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Teléfono</p>
                      <p className="text-sm font-medium text-gray-900">{form.phone}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Modalidad</p>
                      <p className="text-sm font-medium text-gray-900">{session.titulo}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Fecha</p>
                      <p className="text-sm font-medium text-gray-900">{formatDateHuman(selectedDate)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-1">Horario</p>
                      <p className="text-sm font-medium text-gray-900">{selectedTime} hrs</p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl p-4" style={{ background: `${session.color}08`, border: `1px solid ${session.color}15` }}>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong className="text-gray-900">Qué recibirás:</strong> un correo de confirmación con la información de tu sesión, el enlace de Google Meet si corresponde, y un recordatorio automático 12 horas antes.
                    </p>
                  </div>

                  {submitError && (
                    <p className="text-sm mt-4" style={{ color: '#ef4444' }}>
                      {submitError}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={() => setStep('calendar')}
                      className="px-5 py-3 text-sm rounded-xl transition-all"
                      style={{
                        background: 'transparent',
                        border: '1.5px solid rgba(0,0,0,0.06)',
                        color: '#6b7280',
                      }}
                    >
                      Revisar horario
                    </button>
                    <motion.button
                      onClick={handleFinalConfirm}
                      disabled={submitting}
                      whileHover={submitting ? {} : { scale: 1.01 }}
                      whileTap={submitting ? {} : { scale: 0.98 }}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: submitting ? '#cbd5e1' : session.color,
                        color: '#ffffff',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? 'Agendando...' : 'Confirmar y agendar'}
                    </motion.button>
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
