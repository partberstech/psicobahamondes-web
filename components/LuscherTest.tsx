'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const spring = [0.32, 0.72, 0, 1]

// Colores del Test de Lüscher — códigos oficiales
const COLORS = [
  { id: 1, name: 'Azul', hex: '#004983', meaning: 'Necesidad de tranquilidad, armonía y libertad' },
  { id: 2, name: 'Verde', hex: '#1D9772', meaning: 'Autonomía, seguridad, sentido de igualdad' },
  { id: 3, name: 'Rojo', hex: '#F12F23', meaning: 'Vitalidad, acción, fuerza vital, impulso' },
  { id: 4, name: 'Amarillo', hex: '#F2DD00', meaning: 'Optimismo, cambio, esperanza, claridad mental' },
  { id: 5, name: 'Púrpura', hex: '#D42481', meaning: 'Sensibilidad, idealismo, necesidad de protección' },
  { id: 6, name: 'Marrón', hex: '#C55223', meaning: 'Satisfacción, comodidad, sensualidad, seguridad física' },
  { id: 7, name: 'Negro', hex: '#231F20', meaning: 'Rechazo, agresividad, necesidad de protección extrema' },
  { id: 8, name: 'Gris', hex: '#98938D', meaning: 'Neutralidad, protección, deseo de no molestar' },
]

// Interpretaciones en español — adaptadas del dataset en inglés
const INTERPRETATIONS: Record<string, Record<string, string>> = {
  plus: {
    '13': 'Busca una relación afectuosa, satisfactoria y armoniosa. Anhela una unión íntima donde hay amor, sacrificio mutuo y confianza.',
    '23': 'Busca la determinación y elasticidad de voluntad necesarias para establecerse e independizarse a pesar de las dificultades.',
    '34': 'Anhela una vida rica en actividad y experiencia. Quiere desarrollarse libremente y superar la autoduda.',
    '45': 'Sobreimaginativo, dado al fantasimar. Anhela cosas interesantes y emocionantes que le sucedan.',
    '54': 'Capaz de hacerse simpático y ganar apoyo mediante su encanto. Alerta y observador, busca nuevos ideales.',
    '0': 'Necesita liberarse del estrés. Anhela paz, tranquilidad y satisfacción.',
    default: 'Busca satisfacer necesidades de bienestar emocional y personal.',
  },
  asterisk: {
    '5': 'Necesita sentirse identificado con alguien o algo. Anhela apoyo mediante su simpatía. Sentimental y romántico.',
    '4': 'Necesita un cambio en circunstancias que le brinde alivio del estrés. Buscando soluciones mejores.',
    '6': 'Busca libertad de problemas y estado seguro de comodidad física para relajarse.',
    '2': 'Desea armonía tranquila y satisfacción pacífica.',
    '7': 'Considera las circunstancias actuales desagradables y exigentes. Se protege activamente.',
    default: 'Presenta conflictos entre lo que quiere y lo que puede obtener.',
  },
  equal: {
    '12': 'Necesita un ambiente pacífico. Busca liberación del estrés y controla la situación con precaución.',
    '15': 'Anhela ternura y sensibilidad para fundirse. Sensible hacia lo estético y culto.',
    '20': 'Quiere establecerse y causar impacto pese a circunstancias desfavorables.',
    '60': 'Necesita descanso, relajación, seguridad y libertad de conflictos.',
    default: 'Mantiene control sobre su entorno y emociones.',
  },
  minus: {
    '61': 'Quiere contento, comodidad y ausencia de conflicto. Necesita seguridad y protección.',
    '62': 'Se mantiene bajo estricto control para no colapsar bajo dificultades.',
    '63': 'Tiene un poderoso impulso hacia la sensualidad.',
    '64': 'Siente que hay poca perspectiva de lograr esperanzas y se rinde al sentido.',
    '16': 'Anhela un refugio sin conflictos ofreciendo seguridad y comodidad. Necesita cuidado considerado.',
    '17': 'Necesita alivio urgente. Se siente maltratado y está agitado. Su situación le parece intolerable.',
    '26': 'Siente que se le exige demasiado y está agotado, pero quiere superar dificultades aun así.',
    '27': 'Quiere demostrar superioridad ante la debilidad. Actúa con severidad y actitud autocrática.',
    '30': 'Quiere barrer lo que obstaculiza y seguir impulsos hacia situaciones especiales.',
    '35': 'Preocupado por cosas intensamente excitantes. Busca ser percibido como personalidad interesante.',
    '46': 'En desesperación y necesita alivio. Anhela comodidad y recuperación.',
    '47': 'Intenta escapar mediante decisiones abruptas o cambios de dirección impulsivos.',
    '56': 'Anhela estimulación en atmósfera voluptuosa de lujo sensorial.',
    '57': 'Necesita vínculo o fusión con otro que sea sensualmente satisfactorio.',
    default: 'Muestra señales de agotamiento o protección emocional.',
  },
}

function getColorById(id: number) {
  return COLORS.find(c => c.id === id)
}

function interpretSelection(selection: number[]) {
  // Agrupación según posición (Lüscher)
  const groups = {
    plus: [selection[0], selection[1]],
    asterisk: [selection[2], selection[3]],
    equal: [selection[4], selection[5]],
    minus: [selection[6], selection[7]],
  }

  const results: { group: string; colors: number[]; interpretation: string }[] = []

  Object.entries(groups).forEach(([group, colors]) => {
    const key = group as keyof typeof INTERPRETATIONS
    const interpKey = colors.join('') as string
    const interpretation = INTERPRETATIONS[key]?.[interpKey] || INTERPRETATIONS[key]?.default || 'Sin interpretación disponible'
    
    results.push({
      group,
      colors: colors.filter((c) => c !== undefined) as number[],
      interpretation,
    })
  })

  return results
}

export default function LuscherTest() {
  const [selection, setSelection] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleColorClick = (colorId: number) => {
    if (selection.includes(colorId) || selection.length >= 8) return
    setSelection([...selection, colorId])
  }

  const handleRemove = (idx: number) => {
    setSelection(selection.filter((_, i) => i !== idx))
  }

  const submitTest = () => {
    if (selection.length !== 8) return
    setResults(interpretSelection(selection))
    setShowResults(true)
  }

  const resetTest = () => {
    setSelection([])
    setShowResults(false)
    setResults(null)
  }

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring }}
        className="max-w-2xl mb-10"
      >
        <h2 className="mb-4" style={{ color: '#111827' }}>Test de Lüscher</h2>
        <p className="text-base leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          El Test de Lüscher revela tu estado emocional actual y necesidades psicológicas
          a través de la selección de colores. No hay respuestas correctas o incorrectas —
          simplemente elige los colores que más te atraigan, en orden.
        </p>
      </motion.div>

      {/* Instrucciones */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-8 p-5 rounded-xl"
        style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}
      >
        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#9ca3af' }}>
          Instrucciones
        </h4>
        <ol className="text-sm space-y-1" style={{ color: '#374151', fontFamily: 'var(--font-body)' }}>
          <li>• Haz clic en los colores que más te atraigan, en orden de preferencia</li>
          <li>• Selecciona exactamente 8 colores únicos</li>
          <li>• No pienses demasiado — confía en tu primera intuición</li>
          <li>• El resultado aparecerá inmediatamente después</li>
        </ol>
      </motion.div>

      {/* Paleta de colores */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring, delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef3c7', color: '#d97706' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 18V5" />
              <path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" />
            </svg>
          </div>
          <span className="label">Selecciona 8 colores</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((color, idx) => {
            const selected = selection.includes(color.id)
            const selectedIdx = selection.indexOf(color.id)
            return (
              <motion.button
                key={color.id}
                onClick={() => handleColorClick(color.id)}
                disabled={selection.length >= 8 && !selected}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="aspect-square rounded-xl overflow-hidden relative group"
                style={{
                  background: color.hex,
                  opacity: selected ? 1 : 0.8,
                  cursor: selected ? 'pointer' : 'default',
                }}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.9)' }}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleRemove(selectedIdx) }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.div>
                )}
                <span className="absolute bottom-1 left-1 text-[0.6rem] font-bold text-white drop-shadow" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                  {idx + 1}
                </span>
              </motion.button>
            )
          })}
        </div>

        {selection.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium" style={{ color: '#9ca3af' }}>
                Seleccionados {selection.length}/8
              </span>
              <div className="flex-1 h-1 rounded-full" style={{ background: '#e5e7eb' }}>
                <motion.div className="h-full rounded-full" style={{ background: '#2563eb' }}
                  animate={{ width: `${(selection.length / 8) * 100}%` }} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {selection.map((id, idx) => {
                const color = getColorById(id)!
                return (
                  <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                    style={{ background: `${color.hex}15`, color: '#374151' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: color.hex }} />
                    {idx + 1}. {color.name}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Submit */}
      <AnimatePresence>
        {selection.length === 8 && !showResults && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-8"
          >
            <button onClick={submitTest} className="btn btn-primary">
              Ver Resultado
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resultados */}
      <AnimatePresence>
        {showResults && results && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: spring }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f0fdf4', color: '#059669' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-8.93" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <span className="label">Tu interpretación</span>
            </div>

            <div className="space-y-4">
              {results.map((r: any, i: number) => (
                <div key={i} className="p-5 rounded-xl" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${r.group === 'plus' ? 'bg-blue-500' : r.group === 'asterisk' ? 'bg-purple-500' : r.group === 'equal' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                      {r.group === 'plus' ? 'Objetivos deseados' : r.group === 'asterisk' ? 'Conflictos internos' : r.group === 'equal' ? 'Autoconocimiento' : 'Necesidad de protección'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#374151', fontFamily: 'var(--font-body)' }}>
                    {r.interpretation}
                  </p>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {r.colors.map((c: number) => {
                      const col = getColorById(c)!
                      return (
                        <div key={c} className="w-6 h-6 rounded" style={{ background: col.hex }} title={col.name} />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={resetTest} className="btn btn-ghost mt-6 text-xs" style={{ color: '#2563eb' }}>
              Repetir test
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="text-center p-8" style={{ background: '#f9fafb', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}
      >
        <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
          El Test de Lüscher mide necesidades emocionales, no personalidad.
          Un análisis profundo en una Sesión Cero te ayuda a interpretar tu resultado.
        </p>
        <a href="/contacto" className="btn btn-primary">Agendar Sesión Cero</a>
      </motion.div>
    </div>
  )
}