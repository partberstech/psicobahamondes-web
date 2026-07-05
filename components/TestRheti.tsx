'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TYPES, slideVariants } from './enneagrama-data'
import { RHETI_144 } from './rheti-144'
import Link from 'next/link'

/* ─── Wing name map ─── */
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

/* ─── Framer Motion helpers ─── */
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.35, ease: [0.2, 0, 0, 1] },
}

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  borderRadius: '8px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: '#a3a3a3',
}

/* ═══════════════════════════════════════
   WELCOME SCREEN
   ═══════════════════════════════════════ */
function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="welcome"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="max-w-xl mx-auto"
    >
      <div className="p-10 md:p-14 text-center" style={cardStyle}>
        <span className="text-5xl block mb-4">📋</span>
        <h2
          className="mb-3"
          style={{
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            lineHeight: 0.9,
            fontWeight: 500,
            color: '#242424',
          }}
        >
          Test RHETI Completo
        </h2>
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: '#a3a3a3', letterSpacing: '0.02em' }}
        >
          Riso-Hudson Enneagram Type Indicator v2.5 — 144 preguntas
        </p>
        <p
          className="text-base leading-relaxed mb-6 max-w-md mx-auto"
          style={{ color: '#666666' }}
        >
          {RHETI_144.length} preguntas de elección forzada. En cada una, elige la
          afirmación que más resuene contigo, aunque sea sutilmente. El test completo
          dura aproximadamente 20-30 minutos.
        </p>
        <p
          className="text-sm leading-relaxed mb-8"
          style={{ color: '#666666', fontStyle: 'italic' }}
        >
          Tómate tu tiempo. No hay respuestas correctas o incorrectas.
        </p>
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-sm text-sm font-medium text-white cursor-pointer"
          style={{ background: '#0099ff', border: 'none', transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          Comenzar test (144 preguntas)
        </button>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   QUESTION SCREEN
   ═══════════════════════════════════════ */
function Questions({
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
          <span style={labelStyle}>
            Pregunta {qIndex + 1} de {total}
          </span>
          <span className="text-xs" style={{ color: '#a3a3a3' }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-0.5 mb-6" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <motion.div
            className="h-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            style={{ background: '#0099ff' }}
          />
        </div>

        {/* Prompt */}
        <p
          className="text-sm md:text-base mb-6 leading-relaxed"
          style={{ color: '#242424', fontStyle: 'italic' }}
        >
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
              className="w-full text-left p-4 flex items-start gap-3"
              style={{
                color: '#666666',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                background: '#f5f5f5',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#EDE8DC'
                e.currentTarget.style.borderColor = '#0099ff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5'
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
              }}
            >
              <span
                className="shrink-0 mt-0.5"
                style={{ ...labelStyle, color: '#0099ff' }}
              >
                {opt.letter}
              </span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════ */
function Results({
  scores,
  onReset,
}: {
  scores: Record<number, number>
  onReset: () => void
}) {
  const sorted = Object.entries(scores)
    .map(([id, score]) => ({ id: Number(id), score }))
    .sort((a, b) => b.score - a.score)

  const topTypeId = sorted[0].id
  const topType = TYPES.find((t) => t.id === topTypeId) || TYPES[0]
  const maxScore = Math.max(...Object.values(scores))

  /* Adjacent wing types */
  const adjacentTypes =
    topTypeId === 1
      ? [9, 2]
      : topTypeId === 9
        ? [8, 1]
        : [topTypeId - 1, topTypeId + 1]
  const adjWithScores = adjacentTypes
    .map((id) => ({ id, score: scores[id] || 0 }))
    .sort((a, b) => b.score - a.score)
  const wingType = adjWithScores[0].score >= 1 ? adjWithScores[0].id : null

  /* Stress / Growth arrows */
  const growthType = TYPES.find((t) => t.id === topType.growth)
  const stressType = TYPES.find((t) => t.id === topType.stress)

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
          <span className="text-6xl block mb-3">{topType.emoji}</span>
          <span className="block mb-2" style={labelStyle}>
            Tu tipo predominante
          </span>
          <h2
            className="mb-1"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
              lineHeight: 0.9,
              fontWeight: 500,
              color: '#242424',
            }}
          >
            {topType.title}
          </h2>
          {wingType && (
            <p
              className="text-sm mt-2"
              style={{
                color: '#0099ff',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Ala {wingType}: {WING_NAMES[`${topTypeId}w${wingType}`] || ''}
            </p>
          )}
          <p
            className="text-sm mt-6 leading-relaxed max-w-md mx-auto"
            style={{ color: '#666666' }}
          >
            {topType.desc.split('.')[0]}.
          </p>
        </div>

        {/* ── Score bars ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-4" style={labelStyle}>
            Puntajes por tipo
          </h4>
          <div className="space-y-2">
            {sorted.map(({ id, score }) => {
              const t = TYPES.find((x) => x.id === id)
              if (!t) return null
              const isTop = id === topTypeId
              const barWidth = maxScore > 0 ? (score / maxScore) * 100 : 0
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center shrink-0">
                    {t.emoji}
                  </span>
                  <span
                    className="text-xs w-20 shrink-0"
                    style={{ color: isTop ? '#0099ff' : '#666666' }}
                  >
                    {(t.name || t.title).slice(0, 14)}
                  </span>
                  <div
                    className="flex-1 h-3"
                    style={{
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: '1px',
                    }}
                  >
                    <motion.div
                      className="h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{
                        duration: 0.6,
                        delay: 0.1,
                        ease: [0.2, 0, 0, 1],
                      }}
                      style={{
                        background: isTop ? '#0099ff' : 'rgba(0,0,0,0.12)',
                        borderRadius: '1px',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs w-4 text-right"
                    style={{ color: '#a3a3a3' }}
                  >
                    {score}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Stress / Growth arrows ── */}
        <div className="p-6 md:p-8 mb-6" style={cardStyle}>
          <h4 className="mb-4" style={labelStyle}>
            Direcciones de crecimiento
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Growth */}
            <div
              className="p-4 rounded-sm"
              style={{
                background: '#EDF5F2',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <span className="block mb-2" style={labelStyle}>
                ✅ Integración
              </span>
              <span className="block text-lg mb-1">{growthType?.emoji}</span>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#666666' }}
              >
                {topType.title} → {growthType?.title}: cuando estás saludable,
                incorporas las cualidades positivas del tipo {topType.growth}.
              </p>
            </div>
            {/* Stress */}
            <div
              className="p-4 rounded-sm"
              style={{
                background: '#FDF4F0',
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <span className="block mb-2" style={labelStyle}>
                ⚠️ Estrés
              </span>
              <span className="block text-lg mb-1">{stressType?.emoji}</span>
              <p
                className="text-xs leading-relaxed"
                style={{ color: '#666666' }}
              >
                {topType.title} → {stressType?.title}: bajo estrés, tiendes a
                adoptar patrones del tipo {topType.stress}.
              </p>
            </div>
          </div>
        </div>

        {/* ── Sesión Cero CTA ── */}
        <div
          className="p-6 md:p-8 mb-6 text-center"
          style={{
            ...cardStyle,
            background: '#f5f5f5',
            border: '1px solid #0099ff',
          }}
        >
          <span className="text-3xl block mb-3">🎯</span>
          <h4
            className="text-base mb-2"
            style={{ color: '#242424', fontWeight: 500 }}
          >
            ¿Quieres profundizar estos resultados?
          </h4>
          <p
            className="text-sm leading-relaxed mb-4 max-w-sm mx-auto"
            style={{ color: '#666666' }}
          >
            Una sesión cero con Pedro te permite explorar tu perfil de Eneagrama
            en profundidad, entender tus alas, flechas de crecimiento y cómo este
            conocimiento puede transformar tu vida.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contacto"
              className="px-6 py-3 rounded-sm text-sm font-medium text-white"
              style={{
                background: '#0099ff',
                textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.85'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1'
              }}
            >
              Agendar Sesión Cero
            </Link>
            <span className="text-xs" style={{ color: '#a3a3a3' }}>
              Sin compromiso
            </span>
          </div>
        </div>

        {/* ── Retake button ── */}
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-sm text-sm font-medium cursor-pointer"
            style={{
              color: '#666666',
              background: '#f5f5f5',
              border: '1px solid rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0099ff'
              e.currentTarget.style.color = '#0099ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'
              e.currentTarget.style.color = '#666666'
            }}
          >
            Volver a tomar el test
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════ */
export default function TestRheti() {
  const [screen, setScreen] = useState<'welcome' | 'questions' | 'results'>(
    'welcome'
  )
  const [qIndex, setQIndex] = useState(0)
  const [scores, setScores] = useState<Record<number, number>>({})

  const currentQuestion = useMemo(
    () => RHETI_144[qIndex],
    [qIndex]
  )

  const handleAnswer = (type: number) => {
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 }
    if (qIndex + 1 >= RHETI_144.length) {
      setScores(newScores)
      setScreen('results')
    } else {
      setScores(newScores)
      setQIndex(qIndex + 1)
    }
  }

  const handleReset = () => {
    setScreen('welcome')
    setQIndex(0)
    setScores({})
  }

  return (
    <div className="py-8">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <Welcome onStart={() => setScreen('questions')} />
        )}
        {screen === 'questions' && (
          <Questions
            qIndex={qIndex}
            total={RHETI_144.length}
            question={currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'results' && (
          <Results scores={scores} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  )
}
