'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TYPES, slideVariants } from './enneagrama-data'
import EnneagramCanvas from './EnneagramCanvas'

/* ─────── Colors (Cal.com inspired) ─────── */
const C = {
  text: '#242424',
  bg: '#f5f5f5',
  accent: '#0099ff',
  secondary: '#666666',
  muted: '#a3a3a3',
  border: 'rgba(0,0,0,0.06)',
  card: '#ffffff',
}

/* ─────── Questions ─────── */
const QUESTIONS = [
  {
    pregunta: '¿Qué describe mejor tu forma de ser?',
    opciones: [
      { texto: 'Soy estructurado y me gusta hacer las cosas bien', tipo: 1 },
      { texto: 'Disfruto ayudando y apoyando a los demás', tipo: 2 },
      { texto: 'Soy ambicioso y me enfoco en lograr mis metas', tipo: 3 },
      { texto: 'Me retiro para reflexionar antes de responder', tipo: 5 },
    ],
  },
  {
    pregunta: '¿Qué describe mejor tu relación con las emociones?',
    opciones: [
      { texto: 'Las controlo y prefiero regirme por la razón', tipo: 1 },
      { texto: 'Las siento intensamente y a veces me abruman', tipo: 4 },
      { texto: 'Prefiero enfocarme en soluciones más que sentir', tipo: 3 },
      { texto: 'Las observo desde la distancia para comprenderlas', tipo: 5 },
    ],
  },
  {
    pregunta: '¿Cómo te recargas después de un día agotador?',
    opciones: [
      { texto: 'Compartiendo con personas cercanas', tipo: 2 },
      { texto: 'Haciendo algo divertido y estimulante', tipo: 7 },
      { texto: 'Con tiempo a solas en mi espacio personal', tipo: 5 },
      { texto: 'Haciendo ejercicio o alguna actividad física intensa', tipo: 8 },
    ],
  },
  {
    pregunta: '¿Cuál es tu mayor temor en las relaciones?',
    opciones: [
      { texto: 'No ser lo suficientemente bueno para la otra persona', tipo: 1 },
      { texto: 'No ser valorado o no recibir el mismo cariño que doy', tipo: 2 },
      { texto: 'Ser rechazado o no ser lo que esperan de mí', tipo: 3 },
      { texto: 'Perder mi independencia o sentirme invadido', tipo: 5 },
    ],
  },
  {
    pregunta: '¿Cómo tomas decisiones importantes?',
    opciones: [
      { texto: 'Busco información, analizo pros y contras cuidadosamente', tipo: 6 },
      { texto: 'Confío en mi intuición y en lo que siento', tipo: 4 },
      { texto: 'Evalúo qué opción me dará la mejor experiencia', tipo: 7 },
      { texto: 'Tomo el control y decido con determinación', tipo: 8 },
    ],
  },
  {
    pregunta: '¿Qué crítica recibes con más frecuencia?',
    opciones: [
      { texto: 'Que soy muy autoexigente o perfeccionista', tipo: 1 },
      { texto: 'Que me preocupo demasiado por lo que piensen los demás', tipo: 3 },
      { texto: 'Que evito los conflictos o no digo lo que pienso', tipo: 9 },
      { texto: 'Que soy muy intenso o directo', tipo: 8 },
    ],
  },
  {
    pregunta: '¿Qué valoras más en tu vida?',
    opciones: [
      { texto: 'La seguridad y la lealtad de las personas que me rodean', tipo: 6 },
      { texto: 'La libertad para explorar y vivir nuevas experiencias', tipo: 7 },
      { texto: 'La paz y la armonía en mi entorno', tipo: 9 },
      { texto: 'La autenticidad y la profundidad en todo lo que hago', tipo: 4 },
    ],
  },
  {
    pregunta: '¿Cómo describirías tu ritmo de vida?',
    opciones: [
      { texto: 'Activo y orientado a metas y logros', tipo: 3 },
      { texto: 'Tranquilo, prefiero ir paso a paso sin prisas', tipo: 9 },
      { texto: 'Intenso, soy de extremos y entrega total', tipo: 8 },
      { texto: 'Versátil, me gusta variar y probar cosas nuevas', tipo: 7 },
    ],
  },
]

/* ─────── Welcome Screen ─────── */
function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="welcome"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
      className="flex items-center justify-center"
    >
      <div
        className="w-full p-8 md:p-12 text-center"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <span
          className="block mb-6"
          style={{ fontSize: 48, lineHeight: 1, color: C.accent }}
        >
          ✧
        </span>

        <h2
          className="mb-3"
          style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            lineHeight: 1.2,
            fontWeight: 600,
            color: C.text,
            letterSpacing: '-0.02em',
          }}
        >
          Test Rápido de Eneagrama
        </h2>

        <p
          className="mb-8 max-w-md mx-auto"
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            color: C.secondary,
          }}
        >
          Responde 8 preguntas intuitivas y descubre tu eneatipo base. No hay
          respuestas correctas o incorrectas — solo tu verdad.
        </p>

        <div
          className="max-w-sm mx-auto mb-8 text-left"
          style={{ color: C.secondary, fontSize: '0.875rem' }}
        >
          <p className="mb-2">✦ Tómate tu tiempo, no hay prisa</p>
          <p className="mb-2">✦ Responde desde tu experiencia cotidiana</p>
          <p>✦ Sé honesto contigo mismo</p>
        </div>

        <button
          onClick={onStart}
          className="transition-colors duration-200"
          style={{
            display: 'inline-block',
            padding: '12px 32px',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#ffffff',
            background: C.accent,
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0080e6'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = C.accent
          }}
        >
          Comenzar test
        </button>
      </div>
    </motion.div>
  )
}

/* ─────── Question Screen ─────── */
function QuestionScreen({
  qIndex,
  total,
  pregunta,
  opciones,
  onAnswer,
}: {
  qIndex: number
  total: number
  pregunta: string
  opciones: { texto: string; tipo: number }[]
  onAnswer: (tipo: number) => void
}) {
  const progress = ((qIndex + 1) / total) * 100

  return (
    <motion.div
      key={`q-${qIndex}`}
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
    >
      <div
        className="w-full p-8 md:p-10"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {/* Label */}
        <span
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase' as const,
            color: C.muted,
            marginBottom: 12,
          }}
        >
          Pregunta {qIndex + 1} de {total}
        </span>

        {/* Progress bar */}
        <div
          className="w-full"
          style={{
            height: 2,
            background: C.bg,
            borderRadius: 1,
            marginBottom: 32,
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: C.accent,
              borderRadius: 1,
            }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          />
        </div>

        {/* Question */}
        <h3
          className="mb-8"
          style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            lineHeight: 1.4,
            fontWeight: 500,
            color: C.text,
          }}
        >
          {pregunta}
        </h3>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opciones.map((op, i) => (
            <button
              key={i}
              onClick={() => onAnswer(op.tipo)}
              className="transition-all duration-200"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '14px 18px',
                fontSize: '0.925rem',
                lineHeight: 1.5,
                color: C.secondary,
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.accent
                e.currentTarget.style.background = '#eef6ff'
                e.currentTarget.style.color = C.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.background = C.bg
                e.currentTarget.style.color = C.secondary
              }}
            >
              {op.texto}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ─────── Result Screen ─────── */
function ResultScreen({
  result,
  scores,
  onReset,
}: {
  result: (typeof TYPES)[0]
  scores: number[]
  onReset: () => void
}) {
  return (
    <motion.div
      key="result"
      variants={slideVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
    >
      <div
        className="w-full p-8 md:p-10"
        style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.span
            className="block mb-4"
            style={{ fontSize: 56, lineHeight: 1 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          >
            {result.emoji}
          </motion.span>

          <span
            style={{
              display: 'block',
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase' as const,
              color: C.muted,
              marginBottom: 8,
            }}
          >
            Tu tipo de Eneagrama es
          </span>

          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              lineHeight: 1.1,
              fontWeight: 600,
              color: C.text,
              letterSpacing: '-0.02em',
            }}
          >
            {result.title}
          </h2>
        </div>

        {/* Description */}
        <p
          className="mb-8 text-center max-w-lg mx-auto"
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.7,
            color: C.secondary,
          }}
        >{result.desc}</p>

        {/* Enneagram Diagram */}
        <div className="flex justify-center mb-8">
          <EnneagramCanvas scores={scores} size={320} />
        </div>

        {/* Strengths & Challenges */}
        <div
          className="mb-8"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: '#f0f7ff',
              border: `1px solid ${C.border}`,
            }}
          >
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: C.text,
                marginBottom: 12,
              }}
            >
              🌱 Fortalezas
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.strengths.map((s) => (
                <li
                  key={s}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: C.secondary,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      color: C.accent,
                    }}
                  >
                    ✦
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: 20,
              borderRadius: 8,
              background: '#fef6f2',
              border: `1px solid ${C.border}`,
            }}
          >
            <h4
              style={{
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const,
                color: C.text,
                marginBottom: 12,
              }}
            >
              🔥 Desafíos
            </h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.challenges.map((c) => (
                <li
                  key={c}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 8,
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    color: C.secondary,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: 2,
                      color: C.accent,
                    }}
                  >
                    ✦
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quote */}
        <blockquote
          className="mb-8"
          style={{
            fontSize: '0.9rem',
            lineHeight: 1.7,
            fontStyle: 'italic',
            textAlign: 'center',
            color: C.secondary,
            background: C.bg,
            borderLeft: `3px solid ${C.accent}`,
            padding: '18px 20px',
            borderRadius: 8,
            maxWidth: 480,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {result.cita}
        </blockquote>

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <button
            onClick={onReset}
            className="transition-colors duration-200"
            style={{
              display: 'inline-block',
              padding: '10px 24px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: C.accent,
              background: 'transparent',
              border: `1px solid ${C.accent}`,
              borderRadius: 8,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f0f7ff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            Volver a intentar
          </button>

          <a
            href="/recursos#eneagrama"
            className="transition-colors duration-200"
            style={{
              display: 'inline-block',
              fontSize: '0.85rem',
              fontWeight: 500,
              color: C.muted,
              textDecoration: 'none',
              borderBottom: `1px solid ${C.muted}`,
              paddingBottom: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = C.accent
              e.currentTarget.style.borderColor = C.accent
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = C.muted
              e.currentTarget.style.borderColor = C.muted
            }}
          >
            Ver RHETI Completo →
          </a>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────── Main Component ─────── */
export default function TestRapido() {
  const [screen, setScreen] = useState<'welcome' | 'questions' | 'result'>(
    'welcome'
  )
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleAnswer = useCallback(
    (tipo: number) => {
      const next = [...answers, tipo]
      if (qIndex + 1 >= QUESTIONS.length) {
        setAnswers(next)
        setScreen('result')
      } else {
        setAnswers(next)
        setQIndex(qIndex + 1)
      }
    },
    [answers, qIndex]
  )

  const handleReset = useCallback(() => {
    setScreen('welcome')
    setQIndex(0)
    setAnswers([])
  }, [])

  /* Compute winning Enneagram type */
  const getScores = () => {
    const counts: Record<number, number> = {}
    answers.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
    // Calculate percentages for all 9 types
    const total = answers.length || 1
    return Array.from({ length: 9 }, (_, i) => {
      const count = counts[i + 1] || 0
      return Math.round((count / total) * 100)
    })
  }

  const getResult = () => {
    const counts: Record<number, number> = {}
    answers.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1
    })
    let maxCount = 0
    let maxType = 1
    Object.entries(counts).forEach(([t, c]) => {
      if (c > maxCount) {
        maxCount = c
        maxType = Number(t)
      }
    })
    return TYPES.find((t) => t.id === maxType) || TYPES[0]
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <WelcomeScreen onStart={() => setScreen('questions')} />
        )}
        {screen === 'questions' && (
          <QuestionScreen
            qIndex={qIndex}
            total={QUESTIONS.length}
            pregunta={QUESTIONS[qIndex].pregunta}
            opciones={QUESTIONS[qIndex].opciones}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'result' && (
          <ResultScreen result={getResult()} scores={getScores()} onReset={handleReset} />
        )}
      </AnimatePresence>
    </div>
  )
}
