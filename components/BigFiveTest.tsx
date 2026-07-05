'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BIGFIVE_QUESTIONS, DOMAINS, CHOICES, type BigFiveQuestion } from './bigfive-data'

const spring = [0.32, 0.72, 0, 1]
const QUESTIONS_PER_PAGE = 12
const TOTAL_PAGES = Math.ceil(BIGFIVE_QUESTIONS.length / QUESTIONS_PER_PAGE)

interface Scores {
  O: number; C: number; E: number; A: number; N: number
}

type Phase = 'intro' | 'test' | 'results-gated' | 'results'

export default function BigFiveTest() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const currentPageQuestions = BIGFIVE_QUESTIONS.slice(
    page * QUESTIONS_PER_PAGE,
    (page + 1) * QUESTIONS_PER_PAGE
  )

  const progress = ((page + 1) / TOTAL_PAGES) * 100

  const handleAnswer = (questionIndex: number, score: number) => {
    setAnswers({ ...answers, [questionIndex]: score })
  }

  const canProceed = currentPageQuestions.every(
    (_, i) => answers[(page * QUESTIONS_PER_PAGE) + i] !== undefined
  )

  const handleNext = () => {
    if (page < TOTAL_PAGES - 1) {
      setPage(page + 1)
    } else {
      setPhase('results-gated')
    }
  }

  const handlePrev = () => {
    if (page > 0) setPage(page - 1)
  }

  const calculateScores = (): Scores => {
    const scores: Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const counts: Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    BIGFIVE_QUESTIONS.forEach((q, i) => {
      const rawScore = answers[i]
      if (rawScore === undefined) return

      let score = rawScore
      if (q.keyed === 'minus') {
        score = 6 - rawScore // Invert for minus-keyed items
      }

      scores[q.domain as keyof Scores] += score
      counts[q.domain as keyof Scores] += 1
    })

    // Normalize to 0-100
    Object.keys(scores).forEach((key) => {
      const k = key as keyof Scores
      if (counts[k] > 0) {
        scores[k] = Math.round(((scores[k] / counts[k]) - 1) / 4 * 100)
      }
    })

    return scores
  }

  const handleSubmit = () => {
    if (email.trim()) {
      setSubmitted(true)
      setTimeout(() => setPhase('results'), 1500)
    }
  }

  const scores = phase === 'results' ? calculateScores() : null

  return (
    <div>
      <AnimatePresence mode="wait">
        {/* ═══════ INTRO ═══════ */}
        {phase === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-xl mx-auto text-center"
          >
            <span className="eyebrow mb-4">Test de Personalidad</span>
            <h2 className="text-3xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
              Los Cinco Grandes
            </h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: '#4b5563' }}>
              El test de personalidad más validado científicamente. Mide 5 dimensiones
              de tu personalidad con 120 preguntas.
            </p>

            <div className="grid grid-cols-5 gap-2 mb-10 max-w-lg mx-auto">
              {Object.entries(DOMAINS).map(([key, domain]) => (
                <div key={key} className="p-3 rounded-lg text-center" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="text-lg font-bold mb-1" style={{ color: '#2563eb' }}>{key}</div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>{domain.name}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-left mb-10 max-w-sm mx-auto">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>1</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  <strong>120 preguntas</strong> sobre tus hábitos y preferencias
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>2</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  Escala de <strong>5 puntos</strong> (Muy en desacuerdo → Muy de acuerdo)
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>3</div>
                <p className="text-sm" style={{ color: '#4b5563' }}>
                  Tus resultados serán entregados en una <strong>Sesión Cero</strong>
                </p>
              </div>
            </div>

            <button onClick={() => setPhase('test')} className="btn btn-primary" style={{ padding: '14px 40px' }}>
              Comenzar test
            </button>
          </motion.div>
        )}

        {/* ═══════ TEST ═══════ */}
        {phase === 'test' && (
          <motion.div
            key={`page-${page}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: spring }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold" style={{ color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                Página {page + 1} de {TOTAL_PAGES}
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#2563eb' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: spring }}
                />
              </div>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {Math.round(progress)}%
              </span>
            </div>

            {/* Questions */}
            <div className="space-y-6 mb-8">
              {currentPageQuestions.map((q, i) => {
                const globalIndex = page * QUESTIONS_PER_PAGE + i
                const selected = answers[globalIndex]
                const currentDomain = q.domain
                const domainInfo = DOMAINS[currentDomain as keyof typeof DOMAINS]

                return (
                  <div key={globalIndex} className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#eff6ff', color: '#2563eb' }}>
                        {domainInfo?.name}
                      </span>
                      <span className="text-xs" style={{ color: '#9ca3af' }}>
                        Pregunta {globalIndex + 1} de {BIGFIVE_QUESTIONS.length}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-3" style={{ color: '#111827' }}>
                      {q.text}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {CHOICES.map((choice) => (
                        <button
                          key={choice.score}
                          onClick={() => handleAnswer(globalIndex, choice.score)}
                          className="px-3 py-1.5 text-xs rounded-lg transition-all"
                          style={{
                            background: selected === choice.score ? '#2563eb' : '#ffffff',
                            color: selected === choice.score ? '#ffffff' : '#6b7280',
                            border: `1px solid ${selected === choice.score ? '#2563eb' : 'rgba(0,0,0,0.08)'}`,
                            fontWeight: selected === choice.score ? 600 : 400,
                          }}
                        >
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button onClick={handlePrev} disabled={page === 0} className="btn btn-ghost" style={{ opacity: page === 0 ? 0.3 : 1 }}>
                ← Anterior
              </button>
              <button
                onClick={handleNext}
                disabled={!canProceed}
                className="btn btn-primary"
                style={{ opacity: canProceed ? 1 : 0.5 }}
              >
                {page < TOTAL_PAGES - 1 ? 'Siguiente' : 'Finalizar'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ RESULTS GATED ═══════ */}
        {phase === 'results-gated' && (
          <motion.div
            key="gated"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-lg mx-auto text-center"
          >
            {!submitted ? (
              <>
                <span className="eyebrow mb-4">Casi listo</span>
                <h2 className="text-2xl font-bold mt-4 mb-4" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                  Completa tus datos para recibir los resultados
                </h2>
                <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
                  Tus resultados serán analizados por un profesional.
                </p>

                <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button onClick={handleSubmit} disabled={!email.trim()} className="btn btn-primary" style={{ opacity: !email.trim() ? 0.5 : 1 }}>
                    Ver mis resultados
                  </button>
                  <a href="/contacto" className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>
                    Agendar Sesión Cero directamente
                  </a>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#dcfce7' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>¡Datos registrados!</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Preparando tus resultados...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {phase === 'results' && scores && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Tu perfil de personalidad</span>
              <h3 className="text-2xl font-bold mt-4 mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                Big Five / OCEAN
              </h3>
            </div>

            {/* Scores visualization */}
            <div className="space-y-4 mb-10">
              {Object.entries(DOMAINS).map(([key, domain]) => {
                const score = scores[key as keyof Scores]
                const level = score >= 70 ? 'Alto' : score >= 30 ? 'Medio' : 'Bajo'
                return (
                  <div key={key} className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold" style={{ color: '#2563eb', fontFamily: 'var(--font-mono)' }}>{key}</span>
                        <span className="text-sm font-medium" style={{ color: '#111827' }}>{domain.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#9ca3af' }}>{level}</span>
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{score}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full mb-2" style={{ background: '#e5e7eb' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: '#2563eb' }}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: spring, delay: 0.2 }}
                      />
                    </div>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{domain.desc}</p>
                  </div>
                )
              })}
            </div>

            {/* Profile summary */}
            <div className="p-6 mb-10" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <span className="label mb-3 block">Tu perfil</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(DOMAINS).map(([key, domain]) => {
                  const score = scores[key as keyof Scores]
                  const isHigh = score >= 70
                  const isLow = score <= 30
                  return (
                    <span
                      key={key}
                      className="pill"
                      style={{
                        background: isHigh ? '#dcfce7' : isLow ? '#fef2f2' : '#f9fafb',
                        color: isHigh ? '#166534' : isLow ? '#991b1b' : '#374151',
                      }}
                    >
                      {domain.name}: {isHigh ? 'Alto' : isLow ? 'Bajo' : 'Medio'}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center p-8" style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                Este test es una exploración inicial. Una interpretación profesional
                del Big Five puede revelar mucho más sobre tu personalidad.
              </p>
              <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
