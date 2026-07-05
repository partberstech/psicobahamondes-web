'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

const RorschachWebGL = dynamic(() => import('@/components/RorschachWebGL'), { ssr: false })

const spring = [0.32, 0.72, 0, 1]

// 5 manchas con animación LENTA (speed reducido)
const SHADER_PARAMS = [
  { sharpness: 0.1, density: 0.1, scale: 1.2, symmetry: 1.0, details: 4, speed: 0.15 },
  { sharpness: 0.1, density: 0.1, scale: 1.2, symmetry: 0.85, details: 4, speed: 0.1 },
  { sharpness: 0.1, density: 0.1, scale: 1.2, symmetry: 0.95, details: 4, speed: 0.2 },
  { sharpness: 0.1, density: 0.1, scale: 1.2, symmetry: 0.7, details: 4, speed: 0.12 },
  { sharpness: 0.1, density: 0.1, scale: 1.2, symmetry: 0.9, details: 4, speed: 0.18 },
]

const INKBLOTS = [
  { id: 1, label: 'Mancha I', desc: 'Observa con calma cada detalle' },
  { id: 2, label: 'Mancha II', desc: 'No hay respuestas correctas o incorrectas' },
  { id: 3, label: 'Mancha III', desc: 'Describe lo que tú percibes' },
  { id: 4, label: 'Mancha IV', desc: 'Tómate tu tiempo' },
  { id: 5, label: 'Mancha V', desc: 'Confía en tu primera impresión' },
]

const QUESTIONS = [
  { id: 'what', text: '¿Qué ves en esta mancha?', hint: 'Describe las formas que identificas' },
  { id: 'movement', text: '¿Lo que ves está estático o en movimiento?', hint: 'Percepción de movimiento' },
  { id: 'emotion', text: '¿Qué emoción te provoca?', hint: 'Respuesta emocional' },
]

// Categorías de contenido (Exner)
const CONTENT_CATEGORIES: Record<string, { label: string; keywords: string[] }> = {
  H: { label: 'Humano', keywords: ['hombre', 'mujer', 'persona', 'cara', 'rostro', 'cuerpo', 'figura', 'silueta', 'pareja', 'gente', 'bebé', 'niño'] },
  A: { label: 'Animal', keywords: ['animal', 'perro', 'gato', 'pájaro', 'mariposa', 'murciélago', 'tortuga', 'pez', 'insecto', 'araña', 'rana', 'águila'] },
  Na: { label: 'Naturaleza', keywords: ['árbol', 'flor', 'hoja', 'montaña', 'río', 'lago', 'nube', 'estrella', 'sol', 'luna', 'mar', 'fuego', 'humo'] },
  Cg: { label: 'Objeto', keywords: ['objeto', 'máquina', 'edificio', 'puente', 'instrumento', 'herramienta', 'cohete'] },
  Ab: { label: 'Abstracto', keywords: ['forma', 'figura', 'diseño', 'patrón', 'símbolo', 'energía', 'fuerza', 'armonía', 'desorden'] },
}

const DETERMINANTS: Record<string, { label: string; keywords: string[] }> = {
  F: { label: 'Forma', keywords: ['forma', 'figura', 'silueta', 'contorno', 'borde', 'línea'] },
  M: { label: 'Movimiento', keywords: ['camina', 'corre', 'baila', 'salta', 'abraza', 'vuela', 'flota'] },
  C: { label: 'Color', keywords: ['rojo', 'azul', 'negro', 'blanco', 'gris', 'verde', 'color'] },
  T: { label: 'Textura', keywords: ['suave', 'áspera', 'lisa', 'blanda', 'dura', 'húmeda'] },
}

function analyzeResponse(answers: Record<string, string>) {
  const allText = Object.values(answers).join(' ').toLowerCase()

  const content: Record<string, number> = {}
  for (const [code, cat] of Object.entries(CONTENT_CATEGORIES)) {
    content[code] = 0
    for (const kw of cat.keywords) {
      if (allText.includes(kw)) content[code]++
    }
  }

  const determinants: Record<string, number> = {}
  for (const [code, det] of Object.entries(DETERMINANTS)) {
    determinants[code] = 0
    for (const kw of det.keywords) {
      if (allText.includes(kw)) determinants[code]++
    }
  }

  const emotions: string[] = []
  const emotionMap: Record<string, string[]> = {
    'miedo': ['miedo', 'terror', 'asusta', 'aterra'],
    'tristeza': ['triste', 'pena', 'dolor'],
    'alegría': ['alegre', 'feliz', 'contento'],
    'calma': ['calma', 'paz', 'tranquilidad'],
    'curiosidad': ['curiosidad', 'intriga', 'misterio'],
    'confusión': ['confusión', 'desconcierto', 'no sé'],
  }
  for (const [emo, kws] of Object.entries(emotionMap)) {
    if (kws.some(kw => allText.includes(kw))) emotions.push(emo)
  }

  return { content, determinants, emotions }
}

function buildProfile(responses: Record<string, string>[]) {
  const allContent: Record<string, number> = { H: 0, A: 0, Na: 0, Cg: 0, Ab: 0 }
  const allDet: Record<string, number> = { F: 0, M: 0, C: 0, T: 0 }
  const allEmotions: string[] = []

  for (const answers of responses) {
    const analysis = analyzeResponse(answers)
    for (const [k, v] of Object.entries(analysis.content)) allContent[k] += v
    for (const [k, v] of Object.entries(analysis.determinants)) allDet[k] += v
    allEmotions.push(...analysis.emotions)
  }

  const maxContent = Math.max(...Object.values(allContent))
  const dominantType = Object.entries(allContent).find(([, v]) => v === maxContent)
  const typeName = dominantType ? (CONTENT_CATEGORIES[dominantType[0]]?.label || 'Abstracto') : 'Abstracto'

  const uniqueEmotions = Array.from(new Set(allEmotions))

  let profile = '', desc = '', traits: string[] = []

  if (typeName === 'Humano' || allDet.M > 0) {
    profile = 'Empático-Social'
    desc = 'Orientado hacia las relaciones humanas. Alta empatía y capacidad de percepción social.'
    traits = ['Empático', 'Social', 'Compasivo', 'Relacional']
  } else if (typeName === 'Animal') {
    profile = 'Práctico-Instintivo'
    desc = 'Conectado con lo básico y lo instintivo. Percepción práctica de la realidad.'
    traits = ['Práctico', 'Instintivo', 'Directo', 'Terrenal']
  } else if (typeName === 'Naturaleza') {
    profile = 'Orgánico-Transcendente'
    desc = 'Vinculado con lo natural y lo trascendente. Búsqueda de armonía.'
    traits = ['Natural', 'Armonioso', 'Trascendente', 'Orgánico']
  } else if (allDet.M > allDet.F) {
    profile = 'Introspectivo-Fantasioso'
    desc = 'Rico mundo interior. Capacidad de fantasía y proyección.'
    traits = ['Introspectivo', 'Imaginativo', 'Profundo', 'Creativo']
  } else {
    profile = 'Analítico-Perceptivo'
    desc = 'Orientado a la forma y la estructura. Percepción analítica y detallada.'
    traits = ['Analítico', 'Perceptivo', 'Detallista', 'Lógico']
  }

  return { profile, desc, traits, emotions: uniqueEmotions, content: allContent, determinants: allDet }
}

type Phase = 'intro' | 'test' | 'results-gated' | 'results'

export default function RorschachTest() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentInkblot, setCurrentInkblot] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>[]>([])
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({})
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const totalInkblots = INKBLOTS.length

  const handleNext = () => {
    const newResponses = [...responses, { ...currentAnswers }]
    setResponses(newResponses)
    if (currentInkblot < totalInkblots - 1) {
      setCurrentInkblot(currentInkblot + 1)
      setCurrentAnswers({})
    } else {
      setPhase('results-gated')
    }
  }

  const handlePrev = () => {
    if (currentInkblot > 0) {
      setCurrentInkblot(currentInkblot - 1)
      setCurrentAnswers({ ...responses[currentInkblot - 1] })
    }
  }

  const handleSubmitContact = () => {
    if (email.trim() || phone.trim()) {
      setSubmitted(true)
      setTimeout(() => setPhase('results'), 1500)
    }
  }

  const results = phase === 'results' ? buildProfile(responses) : null
  const params = SHADER_PARAMS[currentInkblot]

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
            <div className="mb-8">
              <span className="eyebrow mb-4">Test de Rorschach</span>
              <h2 className="text-3xl font-bold mt-4 mb-6" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                Explora tu percepción
              </h2>
            </div>

            <div className="space-y-4 text-left mb-10">
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>1</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Verás <strong>5 manchas</strong> generadas con fractales. Cada una es única.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>2</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Observa cada mancha y responde <strong>3 preguntas</strong> sobre lo que ves.
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>3</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  No hay respuestas correctas o incorrectas. <strong>Confía en tu primera impresión.</strong>
                </p>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold" style={{ background: '#eff6ff', color: '#2563eb' }}>4</div>
                <p className="text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                  Tus resultados serán entregados en una <strong>Sesión Cero</strong> gratuita.
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
            key={`inkblot-${currentInkblot}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: spring }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-semibold" style={{ color: '#2563eb', fontFamily: 'var(--font-display)' }}>
                {INKBLOTS[currentInkblot].label}
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: '#2563eb' }}
                  animate={{ width: `${((currentInkblot + 1) / totalInkblots) * 100}%` }}
                  transition={{ duration: 0.3, ease: spring }}
                />
              </div>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {currentInkblot + 1}/{totalInkblots}
              </span>
            </div>

            {/* Canvas — animación lenta */}
            <div className="mb-6 flex justify-center">
              <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.04)', background: '#fff' }}>
                <RorschachWebGL
                  width={700}
                  height={450}
                  sharpness={params.sharpness}
                  density={params.density}
                  scale={params.scale}
                  symmetry={params.symmetry}
                  details={params.details}
                  speed={params.speed}
                />
              </div>
            </div>

            <p className="text-center text-xs mb-6 italic" style={{ color: '#9ca3af' }}>
              {INKBLOTS[currentInkblot].desc}
            </p>

            {/* Preguntas */}
            <div className="space-y-4 mb-8 max-w-lg">
              {QUESTIONS.map((q) => (
                <div key={q.id}>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#374151', fontFamily: 'var(--font-display)' }}>
                    {q.text}
                  </label>
                  <span className="block text-xs mb-1.5" style={{ color: '#9ca3af' }}>{q.hint}</span>
                  <textarea
                    value={currentAnswers[q.id] || ''}
                    onChange={(e) => setCurrentAnswers({ ...currentAnswers, [q.id]: e.target.value })}
                    placeholder="Escribe tu respuesta..."
                    className="input"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button onClick={handlePrev} disabled={currentInkblot === 0} className="btn btn-ghost" style={{ opacity: currentInkblot === 0 ? 0.3 : 1 }}>
                ← Anterior
              </button>
              <span className="text-xs" style={{ color: '#9ca3af' }}>
                {currentInkblot < totalInkblots - 1 ? `${totalInkblots - currentInkblot - 1} restantes` : 'Última mancha'}
              </span>
              <button onClick={handleNext} className="btn btn-primary">
                {currentInkblot < totalInkblots - 1 ? 'Siguiente' : 'Finalizar'}
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
                <div className="mb-8">
                  <span className="eyebrow mb-4">Casi listo</span>
                  <h2 className="text-2xl font-bold mt-4 mb-4" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                    Completa tus datos para recibir los resultados
                  </h2>
                  <p className="text-sm" style={{ color: '#6b7280' }}>
                    Tus respuestas serán analizadas por un profesional. Los resultados se entregan en una Sesión Cero gratuita.
                  </p>
                </div>

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
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>Teléfono (opcional)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+56 9 XXXX XXXX"
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubmitContact}
                    disabled={!email.trim() && !phone.trim()}
                    className="btn btn-primary"
                    style={{ opacity: !email.trim() && !phone.trim() ? 0.5 : 1 }}
                  >
                    Ver mis resultados
                  </button>
                  <a href="/contacto" className="btn btn-ghost text-sm" style={{ color: '#2563eb' }}>
                    Agendar Sesión Cero directamente
                  </a>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12"
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#dcfce7' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#111827' }}>¡Datos registrados!</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Preparando tus resultados...</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ═══════ RESULTS ═══════ */}
        {phase === 'results' && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: spring }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="eyebrow mb-4">Tu perfil perceptivo</span>
              <h3 className="text-2xl font-bold mt-4 mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                {results.profile}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#4b5563' }}>{results.desc}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {results.traits.map((t) => (
                <span key={t} className="pill pill-brand">{t}</span>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Contenido</span>
                {Object.entries(results.content).filter(([, v]) => v > 0).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs w-20" style={{ color: '#6b7280' }}>{(CONTENT_CATEGORIES as any)[k]?.label}</span>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: '#e5e7eb' }}>
                      <div className="h-full rounded-full" style={{ background: '#2563eb', width: `${Math.min(100, v * 25)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                <span className="label mb-3 block">Emociones</span>
                {results.emotions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {results.emotions.map((e) => (
                      <span key={e} className="pill pill-brand">{e}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: '#9ca3af' }}>No se detectaron emociones específicas</p>
                )}
              </div>
            </div>

            <div className="text-center p-8" style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                Esta es una exploración inicial. Una interpretación profesional del
                Test de Rorschach puede revelar mucho más sobre tu mundo interior.
              </p>
              <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
