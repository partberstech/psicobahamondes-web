'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TYPES, slideVariants } from './enneagrama-data'
import { RHETI_144 } from './rheti-144'
import { getProfileByType } from '@/lib/eneagrama-profiles'

/* ═══════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════ */

type Phase = 'form' | 'questions' | 'results'

type FormData = {
  nombre: string
  email: string
  telefono: string
}

const WING_NAMES: Record<string, string> = {
  '1w9': 'El Idealista',
  '1w2': 'El Abogado',
  '2w1': 'El Servidor',
  '2w3': 'El Anfitrión',
  '3w2': 'La Estrella',
  '3w4': 'El Profesional',
  '4w3': 'El Aristócrata',
  '4w5': 'El Bohemio',
  '5w4': 'El Iconoclasta',
  '5w6': 'El Solucionador',
  '6w5': 'El Guerrero',
  '6w7': 'El Compañero',
  '7w6': 'El Animador',
  '7w8': 'El Realista',
  '8w7': 'El Independiente',
  '8w9': 'El Oso',
  '9w8': 'El Árbitro',
  '9w1': 'El Soñador',
}

// Full type data for detailed results (mirrors TYPES + extras)
const TYPES_FULL = [
  {
    id: 1, emoji: '🔹', title: 'El Reformador', center: 'Instintivo', centerColor: '#2563eb',
    coreFear: 'Ser malo/a, defectuoso/a o corrupto/a',
    coreDesire: 'Ser bueno/a, íntegro/a y equilibrado/a',
    strengths: ['Integridad moral', 'Capacidad de mejora', 'Responsabilidad', 'Visión clara'],
    challenges: ['Autocrítica excesiva', 'Rigidez', 'Juicio hacia otros', 'Perfeccionismo'],
    stress: { type: 4, name: 'Hacia el Individualista' },
    growth: { type: 7, name: 'Hacia el Entusiasta' },
    wings: ['1w9 — El Idealista (más tranquilo, filosófico)', '1w2 — El Defensor (más cálido, orientado a personas)'],
  },
  {
    id: 2, emoji: '💙', title: 'El Ayudador', center: 'Emocional', centerColor: '#8b5cf6',
    coreFear: 'No ser amado/a o no ser deseado/a',
    coreDesire: 'Sentirse amado/a y apreciado/a',
    strengths: ['Empatía profunda', 'Generosidad sincera', 'Conexión humana', 'Apoyo incondicional'],
    challenges: ['Descuido propio', 'Necesidad de aprobación', 'Orgullo encubierto', 'Dependencia emocional'],
    stress: { type: 8, name: 'Hacia el Desafiador' },
    growth: { type: 4, name: 'Hacia el Individualista' },
    wings: ['2w1 — El Asistente (más principioso, correcto)', '2w3 — El Anfitrión (más ambicioso, orientado a imagen)'],
  },
  {
    id: 3, emoji: '🏆', title: 'El Triunfador', center: 'Emocional', centerColor: '#8b5cf6',
    coreFear: 'No tener valor, ser insignificante',
    coreDesire: 'Sentirse valioso/a y digno/a',
    strengths: ['Determinación', 'Capacidad de inspirar', 'Adaptabilidad', 'Excelencia'],
    challenges: ['Identificación con la imagen', 'Temor al fracaso', 'Competitividad', 'Desconexión emocional'],
    stress: { type: 9, name: 'Hacia el Pacificador' },
    growth: { type: 6, name: 'Hacia el Leal' },
    wings: ['3w2 — El Vendedor (más carismático, orientado a personas)', '3w4 — El Profesional (más creativo, introspectivo)'],
  },
  {
    id: 4, emoji: '🎨', title: 'El Individualista', center: 'Emocional', centerColor: '#8b5cf6',
    coreFear: 'No tener identidad personal o significado',
    coreDesire: 'Encontrar su identidad e importancia',
    strengths: ['Creatividad profunda', 'Compasión', 'Honestidad emocional', 'Originalidad'],
    challenges: ['Melancolía', 'Autoabsorción', 'Envidia', 'Inestabilidad emocional'],
    stress: { type: 2, name: 'Hacia el Ayudador' },
    growth: { type: 1, name: 'Hacia el Reformador' },
    wings: ['4w3 — El Artista (más orientado a logros, adaptable)', '4w5 — El Bohemio (más introspectivo, analítico)'],
  },
  {
    id: 5, emoji: '🔍', title: 'El Investigador', center: 'Mental', centerColor: '#059669',
    coreFear: 'Ser inútil, incompetente o incapaz',
    coreDesire: 'Ser capaz y competente',
    strengths: ['Pensamiento visionario', 'Mente abierta', 'Independencia', 'Profundidad analítica'],
    challenges: ['Aislamiento', 'Retención', 'Desapego', 'Evitación emocional'],
    stress: { type: 7, name: 'Hacia el Entusiasta' },
    growth: { type: 8, name: 'Hacia el Desafiador' },
    wings: ['5w4 — El Iconoclasta (más creativo, individualista)', '5w6 — El Problema (más leal, orientado a seguridad)'],
  },
  {
    id: 6, emoji: '🛡️', title: 'El Leal', center: 'Mental', centerColor: '#059669',
    coreFear: 'No tener guía, apoyo o capacidad de sobrevivir',
    coreDesire: 'Tener seguridad y apoyo',
    strengths: ['Lealtad inquebrantable', 'Responsabilidad', 'Coraje real', 'Confianza'],
    challenges: ['Ansiedad', 'Desconfianza', 'Duda', 'Rebeldía'],
    stress: { type: 3, name: 'Hacia el Triunfador' },
    growth: { type: 9, name: 'Hacia el Pacificador' },
    wings: ['6w5 — El Defensor (más analítico, privado)', '6w7 — El Bufón (más sociable, optimista)'],
  },
  {
    id: 7, emoji: '⚡', title: 'El Entusiasta', center: 'Mental', centerColor: '#059669',
    coreFear: 'Estar en dolor o privación',
    coreDesire: 'Ser feliz y satisfecho',
    strengths: ['Optimismo contagioso', 'Versatilidad', 'Creatividad', 'Energía'],
    challenges: ['Dispersión', 'Evitación del dolor', 'Superficialidad', 'Impulsividad'],
    stress: { type: 1, name: 'Hacia el Reformador' },
    growth: { type: 5, name: 'Hacia el Investigador' },
    wings: ['7w6 — El Buddy (más leal, orientado a seguridad)', '7w8 — El Realizador (más asertivo, directo)'],
  },
  {
    id: 8, emoji: '💪', title: 'El Desafiador', center: 'Instintivo', centerColor: '#2563eb',
    coreFear: 'Ser controlado, herido o violado por otros',
    coreDesire: 'Protegerse a sí mismo y a otros',
    strengths: ['Liderazgo natural', 'Determinación', 'Protección', 'Directo y honesto'],
    challenges: ['Dominación', 'Confrontación', 'Intimidación', 'Vulnerabilidad'],
    stress: { type: 5, name: 'Hacia el Investigador' },
    growth: { type: 2, name: 'Hacia el Ayudador' },
    wings: ['8w7 — El Pacificador (más sociable, espontáneo)', '8w9 — El Desafiador (más tranquilo, pacífico)'],
  },
  {
    id: 9, emoji: '☮️', title: 'El Pacificador', center: 'Instintivo', centerColor: '#2563eb',
    coreFear: 'Pérdida y separación, desintegración',
    coreDesire: 'Paz interior y totalidad',
    strengths: ['Armonía', 'Estabilidad', 'Empatía', 'Mediación'],
    challenges: ['Complacencia', 'Evitación del conflicto', 'Pasividad', 'Indecisión'],
    stress: { type: 6, name: 'Hacia el Leal' },
    growth: { type: 3, name: 'Hacia el Triunfador' },
    wings: ['9w8 — El Refugiado (más asertivo, directo)', '9w4 — El Soñador (más creativo, introspectivo)'],
  },
]

/* ═══════════════════════════════════════════════════════
   STYLES (Cal.com-inspired)
   ═══════════════════════════════════════════════════════ */

const C = {
  text: '#242424',
  bg: '#f5f5f5',
  accent: '#0099ff',
  secondary: '#666666',
  muted: '#a3a3a3',
  border: 'rgba(0,0,0,0.06)',
  card: '#ffffff',
}

const cardStyle: React.CSSProperties = {
  background: C.card,
  border: `1px solid ${C.border}`,
  borderRadius: '12px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: C.muted,
}

/* ═══════════════════════════════════════════════════════
   FORM SCREEN — Datos del paciente
   ═══════════════════════════════════════════════════════ */

function FormScreen({
  onSubmit,
}: {
  onSubmit: (data: FormData) => void
}) {
  const [form, setForm] = useState<FormData>({ nombre: '', email: '', telefono: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const validate = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {}
    if (!form.nombre.trim()) errs.nombre = 'Ingresa tu nombre'
    if (!form.email.trim()) errs.email = 'Ingresa tu email'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Email inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.95rem',
    color: C.text,
    background: '#f9fafb',
    border: `1px solid ${hasError ? '#ef4444' : 'rgba(0,0,0,0.08)'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  })

  return (
    <motion.div
      key="form"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="max-w-xl mx-auto"
    >
      <div className="p-8 md:p-12 text-center" style={cardStyle}>
        <span className="block mb-4" style={{ fontSize: 48, lineHeight: 1 }}>📋</span>
        <h2 className="mb-2" style={{
          fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
          lineHeight: 0.9,
          fontWeight: 500,
          color: C.text,
        }}>
          Test de Eneagrama
        </h2>
        <p className="text-sm mb-6" style={{ color: C.muted }}>
          RHETI v2.5 — 144 preguntas de elección forzada
        </p>
        <p className="text-base mb-8 max-w-md mx-auto" style={{ color: C.secondary, lineHeight: 1.6 }}>
          Para enviarte un reporte personalizado y preparar tu sesión, necesitamos tus datos.
          Tus respuestas son confidenciales.
        </p>

        <form onSubmit={handleSubmit} className="text-left max-w-sm mx-auto">
          {/* Nombre */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
              Nombre completo *
            </label>
            <input
              type="text"
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: María González"
              style={inputStyle(!!errors.nombre)}
              onFocus={e => { e.currentTarget.style.borderColor = C.accent }}
              onBlur={e => { e.currentTarget.style.borderColor = errors.nombre ? '#ef4444' : 'rgba(0,0,0,0.08)' }}
            />
            {errors.nombre && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.nombre}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
              Email *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="tu@email.com"
              style={inputStyle(!!errors.email)}
              onFocus={e => { e.currentTarget.style.borderColor = C.accent }}
              onBlur={e => { e.currentTarget.style.borderColor = errors.email ? '#ef4444' : 'rgba(0,0,0,0.08)' }}
            />
            {errors.email && <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.email}</p>}
          </div>

          {/* Teléfono */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
              Teléfono <span style={{ color: C.muted, fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              placeholder="+56 9 1234 5678"
              style={inputStyle(false)}
              onFocus={e => { e.currentTarget.style.borderColor = C.accent }}
              onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
            />
          </div>

          <button
            type="submit"
            className="w-full transition-colors duration-200"
            style={{
              padding: '13px 24px',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#ffffff',
              background: C.accent,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Comenzar test (144 preguntas)
          </button>
        </form>

        <p className="text-xs mt-6" style={{ color: C.muted }}>
          Tómate tu tiempo. No hay respuestas correctas o incorrectas.
        </p>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   QUESTION SCREEN
   ═══════════════════════════════════════════════════════ */

function QuestionScreen({
  qIndex,
  total,
  question,
  onAnswer,
}: {
  qIndex: number
  total: number
  question: (typeof RHETI_144)[0]
  onAnswer: (type: number) => void
}) {
  const progress = ((qIndex + 1) / total) * 100

  return (
    <motion.div
      key={`rq-${qIndex}`}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="max-w-xl mx-auto"
    >
      <div className="p-8 md:p-10" style={cardStyle}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span style={labelStyle}>Pregunta {qIndex + 1} de {total}</span>
          <span className="text-xs" style={{ color: C.muted }}>{Math.round(progress)}%</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 mb-6" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <motion.div
            className="h-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            style={{ background: C.accent }}
          />
        </div>

        {/* Prompt */}
        <p className="text-sm md:text-base mb-6 leading-relaxed" style={{ color: C.text, fontStyle: 'italic' }}>
          ¿Qué frase te describe más?
        </p>

        {/* Options */}
        <div className="space-y-3">
          {[
            { text: question.a, type: question.aType, letter: 'A' },
            { text: question.b, type: question.bType, letter: 'B' },
          ].map((opt) => (
            <button
              key={opt.letter}
              onClick={() => onAnswer(opt.type)}
              className="w-full text-left p-4 flex items-start gap-3 transition-all duration-200"
              style={{
                color: C.secondary,
                fontSize: '0.9rem',
                lineHeight: 1.5,
                background: '#f5f5f5',
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#EDE8DC'
                e.currentTarget.style.borderColor = C.accent
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#f5f5f5'
                e.currentTarget.style.borderColor = C.border
              }}
            >
              <span className="shrink-0 mt-0.5" style={{ ...labelStyle, color: C.accent }}>{opt.letter}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   RESULTS SCREEN — Resumen para el visitante
   ═══════════════════════════════════════════════════════ */

function ResultsScreen({
  scores,
  formData,
  onReset,
}: {
  scores: Record<number, number>
  formData: FormData
  onReset: () => void
}) {
  const [emailSent, setEmailSent] = useState<boolean | null>(null)
  const [sending, setSending] = useState(false)
  const reportAutoSentRef = useRef(false)

  // Compute sorted scores
  const sorted = useMemo(() => {
    return Object.entries(scores)
      .map(([id, score]) => ({ id: Number(id), score }))
      .sort((a, b) => b.score - a.score)
  }, [scores])

  const totalAnswered = useMemo(() => {
    return Object.values(scores).reduce((a, b) => a + b, 0)
  }, [scores])

  const topTypeId = sorted[0]?.id || 1
  const topType = TYPES_FULL.find(t => t.id === topTypeId) || TYPES_FULL[0]

  // Wing calculation
  const adjacentTypes = useMemo(() => {
    if (topTypeId === 1) return [9, 2]
    if (topTypeId === 9) return [8, 1]
    return [topTypeId - 1, topTypeId + 1]
  }, [topTypeId])

  const wingType = useMemo(() => {
    const adjWithScores = adjacentTypes
      .map(id => ({ id, score: scores[id] || 0 }))
      .sort((a, b) => b.score - a.score)
    return adjWithScores[0].score >= 1 ? adjWithScores[0].id : null
  }, [adjacentTypes, scores])

  // Center color
  const centerColorMap: Record<string, string> = {
    Instintivo: '#2563eb',
    Emocional: '#8b5cf6',
    Mental: '#059669',
  }

  // Send report email
  const sendReport = useCallback(async () => {
    setSending(true)
    try {
      const resp = await fetch('/api/eneagrama/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          scores,
          tipoPredominante: topTypeId,
          ala: wingType,
          centro: topType.center,
          timestamp: new Date().toISOString(),
        }),
      })
      const result = await resp.json()
      setEmailSent(result.success === true)
    } catch {
      setEmailSent(false)
    } finally {
      setSending(false)
    }
  }, [formData, scores, topTypeId, wingType, topType.center])

  // Store test data in sessionStorage so the booking page can reference it.
  // reportSent tells the booking flow whether the psychologist already received
  // the report at test-completion time (avoids duplicate emails on booking).
  useEffect(() => {
    try {
      sessionStorage.setItem('eneagrama_test_data', JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        scores,
        tipoPredominante: topTypeId,
        ala: wingType,
        centro: topType.center,
        reportSent: emailSent === true,
      }))
    } catch { /* sessionStorage unavailable */ }
  }, [formData, scores, topTypeId, wingType, topType.center, emailSent])

  // Auto-send report to psychologist as soon as results screen mounts
  useEffect(() => {
    if (!reportAutoSentRef.current) {
      reportAutoSentRef.current = true
      sendReport()
    }
  }, [sendReport])

  return (
    <motion.div
      key="results"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <div className="max-w-xl mx-auto">
        {/* ── Primary type card ── */}
        <div className="p-8 md:p-10 text-center mb-6" style={cardStyle}>
          <motion.span
            className="block mb-3"
            style={{ fontSize: 56, lineHeight: 1 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            {topType.emoji}
          </motion.span>

          <span className="block mb-2" style={labelStyle}>Tu tipo predominante</span>

          <h2 className="mb-1" style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            lineHeight: 0.9,
            fontWeight: 500,
            color: C.text,
          }}>
            Tipo {topTypeId}: {topType.title}
          </h2>

          {wingType && (
            <p className="text-sm mt-2" style={{
              color: C.accent,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Ala {wingType}: {WING_NAMES[`${topTypeId}w${wingType}`] || ''}
            </p>
          )}

          {/* Center badge */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full mt-3"
            style={{
              background: `${centerColorMap[topType.center] || '#2563eb'}15`,
              color: centerColorMap[topType.center] || '#2563eb',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: centerColorMap[topType.center] || '#2563eb' }} />
            Centro {topType.center}
          </span>
        </div>

        {/* ── Top 3 types ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-4" style={labelStyle}>Distribución porcentual</h4>
          <div className="space-y-2">
            {sorted.slice(0, 3).map(({ id, score }) => {
              const t = TYPES_FULL.find(x => x.id === id)
              if (!t) return null
              const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
              const isTop = id === topTypeId
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center shrink-0">{t.emoji}</span>
                  <span className="text-xs w-28 shrink-0" style={{ color: isTop ? C.accent : C.secondary, fontWeight: isTop ? 600 : 400 }}>
                    Tipo {id}
                  </span>
                  <div className="flex-1 h-3" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '2px' }}>
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0, 0, 1] }}
                      style={{ background: isTop ? C.accent : 'rgba(0,0,0,0.12)', borderRadius: '2px' }}
                    />
                  </div>
                  <span className="text-xs w-10 text-right" style={{ color: C.muted, fontWeight: 600 }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Fear & Desire ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)',
            border: '1px solid rgba(239,68,68,0.1)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: '#dc2626', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Miedo Central</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{topType.coreFear}</p>
          </div>
          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid rgba(34,197,94,0.1)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Deseo Central</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{topType.coreDesire}</p>
          </div>
        </div>

        {/* ── Stress & Growth ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-4" style={labelStyle}>Direcciones de estrés y crecimiento</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#fef2f2' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 9l-6 6 6 6" /><path d="M20 4v7a4 4 0 0 1-4 4H4" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: '#dc2626' }}>Estrés → Tipo {topType.stress.type}</span>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{topType.stress.name}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#f0fdf4' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9l6-6-6-6" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                </svg>
              </div>
              <div>
                <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>Crecimiento → Tipo {topType.growth.type}</span>
                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{topType.growth.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Wings ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-4" style={labelStyle}>Alas posibles</h4>
          <div className="space-y-3">
            {topType.wings.map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ background: '#eff6ff' }}>
                  <span className="text-xs font-bold" style={{ color: '#2563eb' }}>{i + 1}</span>
                </div>
                <p className="text-sm" style={{ color: '#4b5563' }}>{w}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Strengths & Challenges ── */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, #f0f7ff 0%, #eff6ff 100%)',
            border: '1px solid rgba(37,99,235,0.1)',
          }}>
            <span className="block mb-3 text-xs font-semibold" style={{ color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Fortalezas</span>
            <div className="space-y-2">
              {topType.strengths.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-sm" style={{ color: '#4b5563' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-xl" style={{
            background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)',
            border: '1px solid rgba(234,88,12,0.1)',
          }}>
            <span className="block mb-3 text-xs font-semibold" style={{ color: '#ea580c', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Desafíos</span>
            <div className="space-y-2">
              {topType.challenges.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                  </svg>
                  <span className="text-sm" style={{ color: '#4b5563' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
           INFOGRAPHICS — Visual charts & diagrams
           ═══════════════════════════════════════════════ */}

        {/* ── Full 9-Type Horizontal Bar Chart ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-5" style={labelStyle}>Todos tus tipos — puntuación completa</h4>
          <div className="space-y-2.5">
            {sorted.map(({ id, score }) => {
              const t = TYPES_FULL.find(x => x.id === id)
              if (!t) return null
              const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0
              const isTop = id === topTypeId
              const centerColor = centerColorMap[t.center] || '#2563eb'
              return (
                <div key={id} className="flex items-center gap-2.5">
                  <span className="text-sm w-6 text-center shrink-0">{t.emoji}</span>
                  <span className="text-xs w-20 shrink-0" style={{ color: isTop ? C.accent : C.secondary, fontWeight: isTop ? 700 : 500 }}>
                    Tipo {id}
                  </span>
                  <div className="flex-1 h-4 relative overflow-hidden" style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 4 }}>
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(pct, 1)}%` }}
                      transition={{ duration: 0.8, delay: 0.05 * (id - 1), ease: [0.2, 0, 0, 1] }}
                      style={{
                        background: isTop
                          ? `linear-gradient(90deg, ${C.accent}, ${centerColor})`
                          : `${centerColor}30`,
                        borderRadius: 4,
                      }}
                    />
                  </div>
                  <span className="text-xs w-10 text-right tabular-nums" style={{ color: isTop ? C.accent : C.muted, fontWeight: 600 }}>
                    {pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Radar / Spider Chart — Top 3 Types ── */}
        {(() => {
          const top3 = sorted.slice(0, 3)
          if (top3.length < 3) return null
          const maxScore = top3[0]?.score || 1
          const rcx = 150, rcy = 150, maxR = 110
          const vertices = top3.map((item, i) => {
            const angle = (i * 120 - 90) * (Math.PI / 180)
            const intensity = maxScore > 0 ? item.score / maxScore : 0
            const r = maxR * Math.max(intensity, 0.15)
            return {
              x: rcx + r * Math.cos(angle),
              y: rcy + r * Math.sin(angle),
              lx: rcx + (maxR + 32) * Math.cos(angle),
              ly: rcy + (maxR + 32) * Math.sin(angle),
              type: item,
            }
          })
          const polyPts = vertices.map(v => `${v.x},${v.y}`).join(' ')
          const findType = (id: number) => TYPES_FULL.find(x => x.id === id)
          return (
            <div className="p-6 md:p-8 mb-6" style={cardStyle}>
              <h4 className="mb-5" style={labelStyle}>Tus 3 tipos principales</h4>
              <div className="flex justify-center">
                <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: 320 }}>
                  {/* Concentric guide rings */}
                  {[0.33, 0.66, 1].map((scale, i) => (
                    <circle key={i} cx={rcx} cy={rcy} r={maxR * scale} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={1} strokeDasharray={i < 2 ? '4 3' : undefined} />
                  ))}
                  {/* Axis lines from center to each vertex */}
                  {vertices.map((v, i) => (
                    <line key={i} x1={rcx} y1={rcy} x2={v.x} y2={v.y} stroke="rgba(0,0,0,0.07)" strokeWidth={1} />
                  ))}
                  {/* Filled polygon */}
                  <polygon
                    points={polyPts}
                    fill="rgba(0,153,255,0.10)"
                    stroke={C.accent}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                  {/* Vertex dots */}
                  {vertices.map((v, i) => (
                    <circle key={i} cx={v.x} cy={v.y} r={5} fill={C.accent} stroke="#fff" strokeWidth={2} />
                  ))}
                  {/* Labels outside each vertex */}
                  {vertices.map((v, i) => {
                    const type = findType(v.type.id)
                    const pct = totalAnswered > 0 ? Math.round((v.type.score / totalAnswered) * 100) : 0
                    return (
                      <g key={i}>
                        <text x={v.lx} y={v.ly - 7} textAnchor="middle" dominantBaseline="middle"
                          style={{ fontSize: 13, fontWeight: 600, fill: C.text }}>
                          {type?.emoji} Tipo {v.type.id}
                        </text>
                        <text x={v.lx} y={v.ly + 8} textAnchor="middle" dominantBaseline="middle"
                          style={{ fontSize: 11, fill: C.muted, fontWeight: 500 }}>
                          {pct}%
                        </text>
                      </g>
                    )
                  })}
                  {/* Center dot */}
                  <circle cx={rcx} cy={rcy} r={2} fill={C.muted} />
                </svg>
              </div>
            </div>
          )
        })()}

        {/* ── Enneagram Circle Diagram ── */}
        {(() => {
          const svgSize = 400
          const ecx = svgSize / 2, ecy = svgSize / 2, er = 140
          const typePos: Record<number, { x: number; y: number }> = {}
          for (let tp = 1; tp <= 9; tp++) {
            const pos = tp % 9
            const angle = (pos * 40 - 90) * (Math.PI / 180)
            typePos[tp] = { x: ecx + er * Math.cos(angle), y: ecy + er * Math.sin(angle) }
          }
          // Triangle: 3-6-9
          const triPts = [3, 6, 9].map(t => `${typePos[t].x},${typePos[t].y}`).join(' ')
          // Hexad: 1-4-2-8-5-7-1
          const hexPath = [1, 4, 2, 8, 5, 7, 1].map((t, i) => `${i === 0 ? 'M' : 'L'}${typePos[t].x},${typePos[t].y}`).join(' ')
          const findType = (id: number) => TYPES_FULL.find(x => x.id === id)
          const topPct = totalAnswered > 0 ? Math.round((scores[topTypeId] / totalAnswered) * 100) : 0
          return (
            <div className="p-6 md:p-8 mb-6" style={cardStyle}>
              <h4 className="mb-5" style={labelStyle}>Tu eneagrama</h4>
              <div className="flex justify-center">
                <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width="100%" style={{ maxWidth: 380 }}>
                  {/* Outer circle */}
                  <circle cx={ecx} cy={ecy} r={er} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={1.5} />
                  {/* Triangle (3-6-9) */}
                  <polygon points={triPts} fill="none" stroke="rgba(0,153,255,0.20)" strokeWidth={1.5} strokeLinejoin="round" />
                  {/* Hexad (1-4-2-8-5-7) */}
                  <path d={hexPath} fill="none" stroke="rgba(139,92,246,0.18)" strokeWidth={1.5} strokeLinejoin="round" />
                  {/* Type dots, labels, and scores */}
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(tp => {
                    const pos = typePos[tp]
                    const isTop = tp === topTypeId
                    const typeData = findType(tp)
                    const centerColor = centerColorMap[typeData?.center || ''] || '#2563eb'
                    // Outward label position
                    const labelR = er + 22
                    const pos2 = tp % 9
                    const angle = (pos2 * 40 - 90) * (Math.PI / 180)
                    const lx = ecx + labelR * Math.cos(angle)
                    const ly = ecy + labelR * Math.sin(angle)
                    return (
                      <g key={tp}>
                        {/* Glow behind highlighted type */}
                        {isTop && (
                          <circle cx={pos.x} cy={pos.y} r={22} fill={centerColor} opacity={0.10} />
                        )}
                        {/* Dot */}
                        <circle
                          cx={pos.x} cy={pos.y}
                          r={isTop ? 10 : 5}
                          fill={isTop ? centerColor : '#d1d5db'}
                          stroke={isTop ? '#fff' : 'none'}
                          strokeWidth={isTop ? 3 : 0}
                        />
                        {/* Label (type number or emoji+name for top) */}
                        {isTop ? (
                          <>
                            <text x={lx} y={ly - 5} textAnchor="middle" dominantBaseline="middle"
                              style={{ fontSize: 13, fontWeight: 700, fill: centerColor }}>
                              {typeData?.emoji} Tipo {tp}
                            </text>
                            <text x={lx} y={ly + 10} textAnchor="middle" dominantBaseline="middle"
                              style={{ fontSize: 10, fontWeight: 600, fill: C.muted }}>
                              {topPct}%
                            </text>
                          </>
                        ) : (
                          <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                            style={{ fontSize: 11, fontWeight: 500, fill: '#9ca3af' }}>
                            {tp}
                          </text>
                        )}
                      </g>
                    )
                  })}
                  {/* Center label */}
                  <text x={ecx} y={ecy - 6} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 10, fontWeight: 600, fill: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>
                    {findType(topTypeId)?.center}
                  </text>
                  <text x={ecx} y={ecy + 8} textAnchor="middle" dominantBaseline="middle"
                    style={{ fontSize: 9, fill: C.muted }}>
                    Centro
                  </text>
                </svg>
              </div>
              <p className="text-center text-xs mt-3" style={{ color: C.muted }}>
                Los 9 tipos ordenados en el círculo clásico del eneagrama. Tu tipo predominante está resaltado.
              </p>
            </div>
          )
        })()}

        {/* ── Profile Summary (detallado, ~1000 chars) ── */}
        {(() => {
          const profile = getProfileByType(topTypeId)
          if (!profile) return null
          return (
            <div className="p-6 md:p-8 mb-6" style={cardStyle}>
              <h4 className="mb-4" style={labelStyle}>Tu perfil en profundidad</h4>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
                {profile.summary}
              </p>
            </div>
          )
        })()}

        {/* ── Report status + Book session ── */}
        <div className="p-6 md:p-8 mb-6 text-center" style={{
          ...cardStyle,
          background: '#f5f5f5',
          border: '1px solid #0099ff',
        }}>
          <span className="text-3xl block mb-3">📧</span>
          <h4 className="text-base mb-2" style={{ color: C.text, fontWeight: 500 }}>
            Reporte enviado al psicólogo
          </h4>
          <p className="text-sm leading-relaxed mb-4 max-w-md mx-auto" style={{ color: C.secondary }}>
            {emailSent === null ? (
              <>{sending ? 'Enviando tu reporte...' : 'Preparando reporte...'}</>
            ) : emailSent ? (
              '✅ Tu reporte fue enviado correctamente al psicólogo. Él lo revisará antes de tu sesión.'
            ) : (
              'No se pudo enviar el reporte automáticamente. Puedes contactar directamente.'
            )}
          </p>

          <p className="text-xs mb-4 max-w-md mx-auto" style={{ color: C.muted }}>
            Al agendar una consulta o Sesión Cero, también recibirás tu reporte de Eneagrama en tu correo para conversarlo juntos.
          </p>

          <a
            href="/contacto?from-eneagrama=true"
            className="inline-block px-6 py-3 rounded-sm text-sm font-medium text-white no-underline transition-opacity mt-2"
            style={{ background: C.accent }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            Agendar Sesión Cero
          </a>
          <p className="text-xs mt-3" style={{ color: C.muted }}>
            Sin compromiso. Conversemos y resolvemos tus dudas.
          </p>
        </div>

        {/* ── Reset ── */}
        <div className="flex justify-center mb-8">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-sm text-sm font-medium cursor-pointer transition-all duration-200"
            style={{
              color: C.secondary,
              background: '#f5f5f5',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = C.accent
              e.currentTarget.style.color = C.accent
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
              e.currentTarget.style.color = C.secondary
            }}
          >
            Volver a tomar el test
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export default function EneagramaTestCompleto() {
  const [phase, setPhase] = useState<Phase>('form')
  const [formData, setFormData] = useState<FormData>({ nombre: '', email: '', telefono: '' })
  const [qIndex, setQIndex] = useState(0)
  const [scores, setScores] = useState<Record<number, number>>({})

  const currentQuestion = useMemo(() => RHETI_144[qIndex], [qIndex])

  const handleFormSubmit = useCallback((data: FormData) => {
    setFormData(data)
    setPhase('questions')
  }, [])

  const handleAnswer = useCallback((type: number) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 }
    if (qIndex + 1 >= RHETI_144.length) {
      setScores(newScores)
      setPhase('results')
    } else {
      setScores(newScores)
      setQIndex(qIndex + 1)
    }
  }, [scores, qIndex])

  const handleReset = useCallback(() => {
    setPhase('form')
    setFormData({ nombre: '', email: '', telefono: '' })
    setQIndex(0)
    setScores({})
  }, [])

  return (
    <div className="py-8">
      <AnimatePresence mode="wait">
        {phase === 'form' && (
          <FormScreen onSubmit={handleFormSubmit} />
        )}
        {phase === 'questions' && (
          <QuestionScreen
            qIndex={qIndex}
            total={RHETI_144.length}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
        {phase === 'results' && (
          <ResultsScreen
            scores={scores}
            formData={formData}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
