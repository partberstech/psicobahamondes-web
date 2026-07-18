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
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [reportSent, setReportSent] = useState<boolean | null>(null)

  // Detect if user came from eneagrama test, and if so load test data
  const [fromEneagrama] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    return params.get('from-eneagrama') === 'true'
  })
  const [eneagramaData] = useState(() => {
    if (typeof window === 'undefined') return null
    try {
      const raw = sessionStorage.getItem('eneagrama_test_data')
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

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
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return
    setConfirming(true)
    setError('')
    try {
      const resp = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          date: selectedDate,
          time: selectedTime,
        }),
      })
      const data = await resp.json()
      if (resp.ok) {
        setDone(true)
        // If user came from eneagrama test, send the report now
        if (fromEneagrama && eneagramaData) {
          try {
            const reportResp = await fetch('/api/eneagrama/report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nombre: eneagramaData.nombre,
                email: eneagramaData.email,
                telefono: eneagramaData.telefono || '',
                scores: eneagramaData.scores,
                tipoPredominante: eneagramaData.tipoPredominante,
                ala: eneagramaData.ala,
                centro: eneagramaData.centro,
                timestamp: new Date().toISOString(),
              }),
            })
            const reportResult = await reportResp.json()
            setReportSent(reportResult.success === true)
          } catch {
            setReportSent(false)
          }
        }
      } else {
        setError(data.error || 'Error al agendar')
      }
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
    }
    setConfirming(false)
  }

  // ─── Done screen ───
  if (done) {
    const [y, m, d] = selectedDate!.split('-')
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        className="text-center py-12"
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${sessionColor}12` }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={sessionColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 style={{ color: '#111827', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }} className="mb-2">
          ¡Consulta agendada!
        </h2>
        <p style={{ color: '#6b7280' }} className="mb-6">
          {d}/{m}/{y} a las {selectedTime} hrs
        </p>

        {/* Report status if coming from eneagrama */}
        {fromEneagrama && (
          <div className="mb-6 p-4 rounded-xl" style={{
            background: reportSent === true ? '#f0fdf4' : reportSent === false ? '#fef2f2' : '#f9fafb',
            border: `1px solid ${reportSent === true ? '#86efac' : reportSent === false ? '#fca5a5' : '#e5e7eb'}`,
          }}>
            {reportSent === null ? (
              <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Enviando reporte al psicólogo...</p>
            ) : reportSent ? (
              <div>
                <p style={{ color: '#16a34a', fontSize: '0.875rem', fontWeight: 600 }} className="mb-1">
                  ✅ Reporte enviado correctamente
                </p>
                <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>
                  El psicólogo recibió el resultado de tu test para preparar la sesión.
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
          Te enviaremos un correo con los detalles. Si no encuentras el mensaje, revisa tu bandeja de spam.
        </p>
        <a
          href={fromEneagrama ? '/recursos' : '/'}
          className="btn btn-brand px-6 py-3 inline-flex items-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {fromEneagrama ? 'Ver mi reporte completo' : 'Volver al inicio'}
        </a>
      </motion.div>
    )
  }

  const formatDate = (d: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }

  return (
    <div>
      {/* ═══ Calendar Grid ═══ */}
      <div className="mb-8">
        {/* Month nav */}
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

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map(d => (
            <div key={d} className="text-center text-[11px] font-semibold py-2" style={{ color: '#9ca3af' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
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
                onClick={() => { setSelectedDate(dateStr); setSelectedTime(null) }}
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

      {/* ═══ Time Slots ═══ */}
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
                      onClick={() => setSelectedTime(slot.time)}
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

            {/* Confirm button */}
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
                onClick={handleConfirm}
                disabled={!selectedTime || confirming}
                whileHover={selectedTime ? { scale: 1.01 } : {}}
                whileTap={selectedTime ? { scale: 0.98 } : {}}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: selectedTime ? sessionColor : '#e5e7eb',
                  color: selectedTime ? '#ffffff' : '#9ca3af',
                  cursor: selectedTime ? 'pointer' : 'not-allowed',
                }}
              >
                {confirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" opacity="0.3" />
                      <path d="M22 12a10 10 0 0 1-10 10" />
                    </svg>
                    Agendando...
                  </span>
                ) : (
                  'Confirmar y agendar'
                )}
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
  )
}
