'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BIGFIVE_QUESTIONS as Q,
  DOMAINS, CHOICES, FACET_LABELS, FACET_DESCRIPTIONS,
  DOMAIN_SECTIONS,
  domainInterpretation, generateProfileNarrative,
} from './bigfive-data'

const spring = [0.32, 0.72, 0, 1]
const Q_PER_PAGE = 12

type Phase = 'intro' | 'select' | 'test' | 'results-gated' | 'results'

interface Scores { O: number; C: number; E: number; A: number; N: number }

export default function BigFiveTest() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [page, setPage] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Active questions based on selections
  const activeQuestions = useMemo(() => {
    if (selectedDomains.length === 0) return Q.map((q, i) => ({ ...q, globalIndex: i }))
    return Q.filter(q => selectedDomains.includes(q.domain)).map((q, i) => ({ ...q, globalIndex: Q.indexOf(q) }))
  }, [selectedDomains])

  const totalPages = Math.ceil(activeQuestions.length / Q_PER_PAGE)
  const currentPageQ = activeQuestions.slice(page * Q_PER_PAGE, (page + 1) * Q_PER_PAGE)
  const progress = ((page + 1) / totalPages) * 100

  const canProceed = currentPageQ.every(q => answers[q.globalIndex] !== undefined)

  const handleAnswer = (globalIndex: number, score: number) => {
    setAnswers(prev => ({ ...prev, [globalIndex]: score }))
  }

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1)
    else setPhase('results-gated')
  }

  const handlePrev = () => { if (page > 0) setPage(page - 1) }

  const completedDomainCount = selectedDomains.length > 0
    ? selectedDomains.length
    : 5

  /* ═══ SCORING ═══ */
  const scores: Scores | null = useMemo(() => {
    if (phase !== 'results') return null
    const raw: Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const cnt: Scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    Q.forEach((q, i) => {
      const rawScore = answers[i]
      if (rawScore === undefined) return
      const score = q.keyed === 'minus' ? 6 - rawScore : rawScore
      const d = q.domain as keyof Scores
      raw[d] += score
      cnt[d] += 1
    })

    const out = {} as Scores
    for (const k of ['O', 'C', 'E', 'A', 'N'] as const) {
      out[k] = cnt[k] > 0 ? Math.round(((raw[k] / cnt[k]) - 1) / 4 * 100) : 0
    }
    return out
  }, [phase])

  /* ═══ FACET SCORES ═══ */
  const facetScores = useMemo(() => {
    if (!scores) return {} as Record<string, Record<number, number>>
    const out: Record<string, Record<number, { sum: number; cnt: number }>> = {}
    Q.forEach((q, i) => {
      const rawScore = answers[i]
      if (rawScore === undefined) return
      const score = q.keyed === 'minus' ? 6 - rawScore : rawScore
      if (!out[q.domain]) out[q.domain] = {}
      if (!out[q.domain][q.facet]) out[q.domain][q.facet] = { sum: 0, cnt: 0 }
      out[q.domain][q.facet].sum += score
      out[q.domain][q.facet].cnt += 1
    })
    const result: Record<string, Record<number, number>> = {}
    for (const d of Object.keys(out)) {
      result[d] = {}
      for (const f of Object.keys(out[d])) {
        const fnum = Number(f)
        const val = ((out[d][fnum].sum / out[d][fnum].cnt) - 1) / 4 * 100
        result[d][fnum] = Math.round(val)
      }
    }
    return result
  }, [scores])

  const profile = useMemo(() => scores ? generateProfileNarrative(scores as unknown as Record<string, number>) : null, [scores])

  const handleGatedSubmit = () => {
    if (email.trim()) {
      setSubmitted(true)
      setTimeout(() => setPhase('results'), 1200)
    }
  }

  const reset = () => {
    setPhase('intro'); setSelectedDomains([]); setPage(0)
    setAnswers({}); setEmail(''); setSubmitted(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {/* ═══════ INTRO ═══════ */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: spring }} className="text-center">
            <span className="eyebrow mb-4">Test de Personalidad</span>
            <h2 className="text-3xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
              Los Cinco Grandes
            </h2>
            <p className="text-base mb-8 leading-relaxed max-w-lg mx-auto" style={{ color: '#4b5563' }}>
              El test de personalidad más validado científicamente. Mide <strong>5 dimensiones</strong> fundamentales con 120 preguntas. Puedes completarlo completo o elegir solo las secciones que te interesen.
            </p>
            <div className="grid grid-cols-5 gap-2 mb-8 max-w-lg mx-auto">
              {Object.entries(DOMAINS).map(([key, d]) => (
                <div key={key} className="p-3 rounded-lg" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="text-lg font-bold mb-0.5" style={{ color: d.color }}>{key}</div>
                  <div className="text-[0.6rem] leading-tight" style={{ color: '#6b7280' }}>{d.name}</div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setPhase('select')} className="btn btn-primary" style={{ padding: '14px 32px' }}>
                Elegir secciones
              </button>
              <button onClick={() => { setSelectedDomains([]); setPhase('test') }} className="btn btn-ghost" style={{ padding: '14px 32px', color: '#2563eb' }}>
                Test completo (120 preguntas)
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ SELECT SECTIONS ═══════ */}
        {phase === 'select' && (
          <motion.div key="select" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: spring }} className="text-center">
            <span className="eyebrow mb-4">Selecciona las secciones</span>
            <h3 className="text-xl font-bold mt-3 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
              ¿Qué dimensiones quieres explorar?
            </h3>
            <div className="space-y-3 mb-8 max-w-sm mx-auto">
              {DOMAIN_SECTIONS.map(d => {
                const active = selectedDomains.includes(d.key)
                return (
                  <button key={d.key} onClick={() => setSelectedDomains(prev =>
                    prev.includes(d.key) ? prev.filter(x => x !== d.key) : [...prev, d.key]
                  )} className="w-full p-4 flex items-center gap-4 text-left rounded-xl transition-all"
                    style={{
                      background: active ? '#eff6ff' : '#f9fafb',
                      border: `1.5px solid ${active ? d.color : 'rgba(0,0,0,0.06)'}`,
                    }}>
                    <div className="w-10 h-10 flex items-center justify-center text-xl font-bold rounded-lg shrink-0"
                      style={{ background: active ? d.color : '#e5e7eb', color: active ? '#fff' : '#9ca3af' }}>
                      {d.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: active ? d.color : '#374151' }}>{d.key}</span>
                        <span className="text-sm font-medium" style={{ color: '#111827' }}>{d.name}</span>
                      </div>
                      <p className="text-xs mt-0.5 truncate" style={{ color: '#9ca3af' }}>{d.desc}</p>
                    </div>
                    <span className="text-xs font-medium shrink-0" style={{ color: '#9ca3af' }}>{d.questionCount} preg.</span>
                  </button>
                )
              })}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setPhase('intro')} className="btn btn-ghost" style={{ color: '#6b7280' }}>
                ← Volver
              </button>
              <button
                onClick={() => setPhase('test')}
                disabled={selectedDomains.length === 0}
                className="btn btn-primary"
                style={{ opacity: selectedDomains.length === 0 ? 0.5 : 1 }}
              >
                Comenzar ({selectedDomains.length} secci{selectedDomains.length === 1 ? 'ón' : 'ones'}, {activeQuestions.length} preguntas)
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ TEST ═══════ */}
        {phase === 'test' && (
          <motion.div key={`p-${page}`} initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: spring }}>
            {/* progress */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold shrink-0" style={{ color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                Pág. {page + 1}/{totalPages}
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div className="h-full rounded-full" style={{ background: '#2563eb' }}
                  animate={{ width: `${progress}%` }} transition={{ duration: 0.3, ease: spring }} />
              </div>
              <span className="text-xs shrink-0" style={{ color: '#9ca3af' }}>{Math.round(progress)}%</span>
            </div>
            {/* questions */}
            <div className="space-y-5 mb-8">
              {currentPageQ.map((q) => {
                const sel = answers[q.globalIndex]
                const d = DOMAINS[q.domain as keyof typeof DOMAINS]
                return (
                  <div key={q.globalIndex} className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded" style={{ background: `${d.color}15`, color: d.color }}>
                        {d.name}
                      </span>
                      <span className="text-[0.6rem]" style={{ color: '#9ca3af' }}>
                        {Object.values(answers).filter(v => v !== undefined).length + 1}/{activeQuestions.length}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-3 leading-relaxed" style={{ color: '#111827' }}>{q.text}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {CHOICES.map(c => (
                        <button key={c.score} onClick={() => handleAnswer(q.globalIndex, c.score)}
                          className="px-2.5 py-1.5 text-[0.65rem] rounded-lg transition-all"
                          style={{
                            background: sel === c.score ? d.color : '#fff',
                            color: sel === c.score ? '#fff' : '#6b7280',
                            border: `1px solid ${sel === c.score ? d.color : 'rgba(0,0,0,0.08)'}`,
                            fontWeight: sel === c.score ? 600 : 400,
                          }}>{c.text}</button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
            {/* nav */}
            <div className="flex justify-between items-center">
              <button onClick={handlePrev} disabled={page === 0}
                className="btn btn-ghost text-sm" style={{ opacity: page === 0 ? 0.3 : 1 }}>← Anterior</button>
              <button onClick={handleNext} disabled={!canProceed}
                className="btn btn-primary" style={{ opacity: canProceed ? 1 : 0.5 }}>
                {page < totalPages - 1 ? 'Siguiente' : 'Finalizar'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ═══════ RESULTS GATED ═══════ */}
        {phase === 'results-gated' && (
          <motion.div key="gated" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5, ease: spring }} className="max-w-lg mx-auto text-center">
            {!submitted ? (
              <>
                <span className="eyebrow mb-4">Casi listo</span>
                <h3 className="text-2xl font-bold mt-4 mb-4" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                  Recibe tu perfil completo
                </h3>
                <p className="text-sm mb-8" style={{ color: '#6b7280' }}>
                  Analizamos {completedDomainCount} dimensi{completedDomainCount === 1 ? 'ón' : 'ones'} de tu personalidad. Déjanos tus datos para recibir los resultados y coordinar una Sesión Cero gratuita.
                </p>
                <div className="space-y-4 mb-8 text-left max-w-sm mx-auto">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" className="input" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button onClick={handleGatedSubmit} disabled={!email.trim()}
                    className="btn btn-primary" style={{ opacity: !email.trim() ? 0.5 : 1 }}>Ver mi perfil</button>
                  <a href="/contacto" className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>Agendar Sesión Cero</a>
                </div>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-12">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#dcfce7' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>¡Datos registrados!</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Preparando tus resultados...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {phase === 'results' && scores && profile && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: spring }}>
            {/* Header */}
            <div className="text-center mb-8">
              <span className="eyebrow mb-4">Tu perfil de personalidad</span>
              <h3 className="text-2xl font-bold mt-3 mb-2" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                {profile.title}
              </h3>
              <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: '#4b5563' }}>
                {profile.summary}
              </p>
            </div>

            {/* Domain scores */}
            <div className="space-y-5 mb-8">
              {Object.entries(DOMAINS).map(([key, d]) => {
                const score = scores[key as keyof Scores]
                if (score === undefined) return null
                const isHigh = score >= 65; const isLow = score <= 35
                const level = isHigh ? 'Alto' : isLow ? 'Bajo' : 'Medio'
                const interp = domainInterpretation(key, score, isHigh, isLow)
                const facets = facetScores[key]
                return (
                  <div key={key} className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-bold rounded-md" style={{ background: d.color, color: '#fff' }}>{key}</span>
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{d.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.65rem]" style={{ color: isHigh ? '#16a34a' : isLow ? '#dc2626' : '#9ca3af' }}>{level}</span>
                        <span className="text-sm font-bold" style={{ color: '#111827' }}>{score}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full mb-2" style={{ background: '#e5e7eb' }}>
                      <motion.div className="h-full rounded-full" style={{ background: d.color }}
                        initial={{ width: 0 }} animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: spring, delay: 0.15 }} />
                    </div>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: '#6b7280' }}>{interp.narrative}</p>

                    {/* Facet chips */}
                    {facets && Object.entries(facets).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pt-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                        {Object.entries(facets).sort(([a], [b]) => Number(a) - Number(b)).map(([fnum, fscore]) => {
                          const fLabel = FACET_LABELS[key]?.[Number(fnum)]
                          const fHigh = fscore >= 65; const fLow = fscore <= 35
                          return (
                            <div key={fnum} className="group relative">
                              <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full" style={{
                                background: fHigh ? `${d.color}20` : fLow ? '#fef2f2' : '#e5e7eb',
                                color: fHigh ? d.color : fLow ? '#dc2626' : '#6b7280',
                              }}>
                                {fLabel || `F${fnum}`}: {fscore}%
                              </span>
                              {FACET_DESCRIPTIONS[key]?.[Number(fnum)] && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 w-48 p-2 rounded-lg text-[0.55rem] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                                  style={{ background: '#1f2937', color: '#e5e7eb' }}>
                                  {FACET_DESCRIPTIONS[key][Number(fnum)]}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Profile synthesis */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {profile.strengths.length > 0 && (
                <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="label mb-3 block">Fortalezas clave</span>
                  <ul className="space-y-2">
                    {profile.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                        <span style={{ color: '#16a34a' }}>✦</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {profile.growths.length > 0 && (
                <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <span className="label mb-3 block">Áreas de desarrollo</span>
                  <ul className="space-y-2">
                    {profile.growths.map((g, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: '#374151' }}>
                        <span style={{ color: '#d97706' }}>○</span> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Careers */}
            {profile.careers.length > 0 && (
              <div className="p-5 mb-8" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Orientaciones profesionales afines</span>
                <div className="flex flex-wrap gap-2">
                  {profile.careers.map((c, i) => (
                    <span key={i} className="pill pill-brand">{c}</span>
                  ))}
                </div>
                <p className="text-[0.6rem] mt-2" style={{ color: '#9ca3af' }}>Basado en patrones de investigación de personalidad y desempeño laboral.</p>
              </div>
            )}

            {/* CTA */}
            <div className="text-center p-8 rounded-2xl" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: '#6b7280' }}>
                Los resultados del Big Five son una herramienta poderosa de autoconocimiento. Una interpretación profesional puede ayudarte a aplicar estos insights en tu vida diaria, relaciones y carrera.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={reset} className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>Repetir test</button>
                <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
