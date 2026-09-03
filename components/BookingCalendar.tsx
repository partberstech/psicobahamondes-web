'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type TimeSlot = { time: string; available: boolean }

type Props = {
  sessionType: string
  sessionColor: string
  onSelect: (date: string, time: string) => void
  onBack: () => void
  userData: { name: string; email: string; phone: string }
}

export default function BookingCalendar({ sessionType, sessionColor, onSelect, onBack, userData }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const fetchSlots = useCallback(async (dateStr: string) => {
    setLoading(true)
    setError('')
    try {
      const resp = await fetch(`/api/availability?type=${sessionType}&date=${dateStr}`)
      const data = await resp.json()
      setSlots(data.slots || [])
    } catch {
      setSlots([])
      setError('No pudimos cargar la disponibilidad. Intenta nuevamente.')
    }
    setLoading(false)
  }, [sessionType])

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  const isPast = (d: number) => {
    const dt = new Date(year, month, d)
    dt.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return dt < now
  }

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDate(null)
    setSelectedTime(null)
    setError('')
  }

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
    setSelectedTime(null)
    setError('')
  }

  const formatDate = (d: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) {
      setError('Selecciona una fecha y un horario para continuar.')
      return
    }
    onSelect(selectedDate, selectedTime)
  }

  return (
    <div>
      <div className="grid md:grid-cols-5 gap-8 items-start">
        {/* Sidebar */}
        <div className="md:col-span-2 space-y-4">
          <div
            className="rounded-2xl p-5"
            style={{
              background: `linear-gradient(135deg, ${sessionColor}06, ${sessionColor}02)`,
              border: `1px solid ${sessionColor}15`,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${sessionColor}12` }}>
                {sessionType === 'sesion-cero' ? '☕' : sessionType === 'consulta-presencial' ? '📍' : '💻'}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#111827' }}>
                  {sessionType === 'sesion-cero' ? 'Sesión Cero' : sessionType === 'consulta-presencial' ? 'Consulta Presencial' : 'Consulta Telemática'}
                </p>
                <p className="text-xs" style={{ color: sessionColor }}>Selecciona fecha y horario</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Horarios actualizados en tiempo real
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                {sessionType === 'consulta-presencial' ? 'Edificio Plaza Bühler, 6to piso' : 'Online'}
              </div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7280' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                3 datos esenciales: nombre, email y teléfono
              </div>
            </div>

            <div className="divider" />
            <div className="mt-4 space-y-1.5">
              <p className="text-xs font-medium" style={{ color: '#111827' }}>{userData.name}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{userData.email}</p>
              <p className="text-xs" style={{ color: '#6b7280' }}>{userData.phone}</p>
            </div>
            <button onClick={onBack} className="flex items-center gap-1 text-xs mt-3 transition-opacity hover:opacity-60" style={{ color: '#2563eb' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
              Volver a datos
            </button>
          </div>

          <div className="text-xs leading-relaxed p-4 rounded-xl flex items-start gap-3" style={{ background: '#f9fafb', color: '#6b7280' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              <strong style={{ color: '#111827' }}>Disponibilidad real:</strong> los horarios se cruzan con Google Calendar y la base de datos en tiempo real.
            </span>
          </div>
        </div>

        {/* Calendar */}
        <div className="md:col-span-3">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[rgba(0,0,0,0.04)]"
                style={{ color: '#6b7280' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.125rem', color: '#111827' }}>
                {monthNames[month]} {year}
              </span>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[rgba(0,0,0,0.04)]"
                style={{ color: '#6b7280' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-1">
              {dayNames.map(d => (
                <div key={d} className="text-center text-[11px] font-semibold py-2" style={{ color: '#9ca3af' }}>
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const d = i + 1
                const dateStr = formatDate(d)
                const disabled = isPast(d)
                const active = selectedDate === dateStr
                return (
                  <motion.button
                    key={d}
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(dateStr)
                      setSelectedTime(null)
                      setError('')
                    }}
                    whileHover={disabled ? {} : { scale: 1.05 }}
                    whileTap={disabled ? {} : { scale: 0.95 }}
                    className="relative aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all duration-200"
                    style={{
                      color: disabled ? '#d1d5db' : active ? '#ffffff' : '#374151',
                      background: active ? sessionColor : 'transparent',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {d}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {selectedDate && (
              <motion.div
                key={selectedDate}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="divider mb-5" />

                <p className="text-sm font-medium mb-4" style={{ color: '#111827' }}>
                  Horarios disponibles{' '}
                  <span style={{ color: '#9ca3af', fontWeight: 400 }}>
                    · {selectedDate}
                  </span>
                </p>

                {loading ? (
                  <div className="flex items-center gap-2 py-6" style={{ color: '#9ca3af' }}>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M22 12a10 10 0 0 1-10 10" />
                    </svg>
                    <span className="text-sm">Cargando horarios...</span>
                  </div>
                ) : slots.length === 0 ? (
                  <p className="text-sm py-4" style={{ color: '#9ca3af' }}>
                    No hay horarios disponibles para este día.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {slots.map((slot) => {
                      const active = selectedTime === slot.time
                      return (
                        <motion.button
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => {
                            if (!slot.available) return
                            setSelectedTime(slot.time)
                            setError('')
                          }}
                          whileHover={slot.available ? { scale: 1.03 } : {}}
                          whileTap={slot.available ? { scale: 0.97 } : {}}
                          className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                          style={{
                            background: active ? sessionColor : slot.available ? `${sessionColor}08` : '#f3f4f6',
                            color: active ? '#ffffff' : slot.available ? sessionColor : '#d1d5db',
                            border: `1.5px solid ${active ? sessionColor : slot.available ? `${sessionColor}30` : '#e5e7eb'}`,
                            cursor: slot.available ? 'pointer' : 'not-allowed',
                            opacity: slot.available ? 1 : 0.5,
                          }}
                        >
                          {slot.time}
                          <span className="text-[10px] ml-1">
                            {slot.available ? '' : '· ocupado'}
                          </span>
                        </motion.button>
                      )
                    })}
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={onBack}
                    className="btn px-5 py-3 text-sm rounded-xl transition-all"
                    style={{
                      background: 'transparent',
                      border: '1.5px solid rgba(0,0,0,0.06)',
                      color: '#6b7280',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Atrás
                  </button>

                  <motion.button
                    onClick={handleContinue}
                    whileHover={selectedTime ? { scale: 1.01 } : {}}
                    whileTap={selectedTime ? { scale: 0.98 } : {}}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: selectedTime ? sessionColor : '#e5e7eb',
                      color: selectedTime ? '#ffffff' : '#9ca3af',
                      cursor: selectedTime ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Continuar
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline ml-2">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </motion.button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs mt-3 text-center"
                    style={{ color: '#ef4444' }}
                  >
                    {error}
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
