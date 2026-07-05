'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TYPES, fadeUp } from './enneagrama-data'

/* ─────── SVG ENNEAGRON POSITIONS (polar coords, 9-point star) ─────── */
/* Numbered in standard enneagram order around the circle */
const POSITIONS: Record<number, { x: number; y: number }> = {
  9:  { x: 250, y: 40 },
  1:  { x: 345, y: 100 },
  2:  { x: 380, y: 210 },
  3:  { x: 340, y: 330 },
  4:  { x: 250, y: 380 },
  5:  { x: 160, y: 330 },
  6:  { x: 120, y: 210 },
  7:  { x: 155, y: 100 },
  8:  { x: 250, y: 155 },
}

/* Arrow paths (stress/disintegration) — standard enneagram arrows */
const STRESS_ARROWS: [number, number][] = [
  [1, 4], [4, 2], [2, 8], [8, 5], [5, 7], [7, 1], [9, 6], [6, 3], [3, 9],
]

/* Arrow paths (growth/integration) — reverse of stress */
const GROWTH_ARROWS: [number, number][] = [
  [1, 7], [7, 5], [5, 8], [8, 2], [2, 4], [4, 1], [9, 3], [3, 6], [6, 9],
]

function getCenter(pair: [number, number]): { x: number; y: number } {
  const a = POSITIONS[pair[0]]
  const b = POSITIONS[pair[1]]
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

const CENTER_COLORS: Record<string, string> = {
  Instintivo: '#E8C5A0',   // 8,9,1
  Emocional: '#A0C4E8',    // 2,3,4
  Mental: '#C5A0E8',       // 5,6,7
}

export default function EneagramaExplorador() {
  const [selected, setSelected] = useState<number | null>(null)
  const [showArrows, setShowArrows] = useState<'stress' | 'growth' | 'none'>('none')

  const selectedType = selected ? TYPES.find((t) => t.id === selected) : null

  /* Helper to get arrow endpoints with slight offset from node center */
  const arrowPath = (from: number, to: number, offset = 18) => {
    const a = POSITIONS[from]
    const b = POSITIONS[to]
    const dx = b.x - a.x
    const dy = b.y - a.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / dist
    const ny = dy / dist
    const x1 = a.x + nx * offset
    const y1 = a.y + ny * offset
    const x2 = b.x - nx * offset
    const y2 = b.y - ny * offset
    return `M${x1},${y1}L${x2},${y2}`
  }

  const arrowColor = showArrows === 'stress' ? '#0099ff' : '#2F5B4F'

  return (
    <div>
      <motion.div {...fadeUp} className="max-w-3xl mx-auto text-center mb-8">
        <h3 className="text-xl mb-3" style={{ color: '#242424', fontWeight: 500 }}>
          Explorador Interactivo del Eneagrama
        </h3>
        <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#666666' }}>
          Haz clic en cualquier número del diagrama para explorar su perfil. Activa las flechas para ver las direcciones de estrés e integración.
        </p>

        {/* Arrow toggles */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {(['stress', 'growth', 'none'] as const).map((mode) => {
            const labels = { stress: '⚠️ Estrés', growth: '✅ Integración', none: 'Sin flechas' }
            return (
              <button
                key={mode}
                onClick={() => setShowArrows(mode)}
                className="label"
                style={{
                  padding: '0.4rem 0.8rem',
                  background: showArrows === mode ? '#0099ff' : 'transparent',
                  color: showArrows === mode ? '#FFFFFF' : '#666666',
                  border: '1px solid',
                  borderColor: showArrows === mode ? '#0099ff' : 'rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  fontSize: '0.6rem',
                }}
              >
                {labels[mode]}
              </button>
            )
          })}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
        {/* SVG Diagram */}
        <div className="card p-4 flex items-center justify-center" style={{ minHeight: '440px' }}>
          <svg viewBox="0 0 500 420" className="w-full max-w-[420px] h-auto">
            {/* Center wedges (subtle background) */}
            {[1, 2, 8, 9].map((id) => {
              const p = POSITIONS[id]
              return (
                <circle key={`c-${id}`} cx={p.x} cy={p.y} r="62" fill="rgba(0,0,0,0.02)" stroke="none" />
              )
            })}

            {/* Connection lines (inner triangle) */}
            <line x1="250" y1="40" x2="380" y2="210" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <line x1="380" y1="210" x2="120" y2="210" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <line x1="120" y1="210" x2="250" y2="40" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            {/* Hexagon connectors */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const a = POSITIONS[i]
              const b = POSITIONS[i + 1]
              if (!a || !b) return null
              return <line key={`hex-${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            })}
            {/* 9 to 1 */}
            <line x1={POSITIONS[9].x} y1={POSITIONS[9].y} x2={POSITIONS[1].x} y2={POSITIONS[1].y} stroke="rgba(0,0,0,0.06)" strokeWidth="1" />

            {/* Stress arrows */}
            {showArrows === 'stress' && STRESS_ARROWS.map(([from, to]) => (
              <path key={`s-${from}-${to}`} d={arrowPath(from, to, 25)} fill="none" stroke="#0099ff" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowRed)" />
            ))}
            {/* Growth arrows */}
            {showArrows === 'growth' && GROWTH_ARROWS.map(([from, to]) => (
              <path key={`g-${from}-${to}`} d={arrowPath(from, to, 25)} fill="none" stroke="#2F5B4F" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arrowGreen)" />
            ))}

            {/* Arrow markers */}
            <defs>
              <marker id="arrowRed" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10Z" fill="#0099ff" />
              </marker>
              <marker id="arrowGreen" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0L10,5L0,10Z" fill="#2F5B4F" />
              </marker>
            </defs>

            {/* Type nodes */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
              const p = POSITIONS[id]
              const t = TYPES.find((t) => t.id === id)!
              const isSelected = selected === id
              const centerColor = CENTER_COLORS[t.center] || '#E8E0D0'
              return (
                <g key={id} onClick={() => setSelected(id)} style={{ cursor: 'pointer' }}>
                  {/* Halo */}
                  <circle cx={p.x} cy={p.y} r="24" fill={isSelected ? centerColor : '#FFFFFF'} stroke={isSelected ? '#0099ff' : 'rgba(0,0,0,0.15)'} strokeWidth={isSelected ? 2 : 1}
                    style={{ transition: 'all 0.2s' }} />
                  {/* Number */}
                  <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central"
                    style={{ fontSize: '14px', fontWeight: 700, fill: '#242424', cursor: 'pointer' }}>
                    {id}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* Info card */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {selectedType ? (
              <motion.div key={selectedType.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{selectedType.emoji}</span>
                  <div>
                    <span className="label block" style={{ color: '#0099ff' }}>{selectedType.center}</span>
                    <h3 className="text-lg" style={{ color: '#242424', fontWeight: 500, lineHeight: 1.1 }}>
                      {selectedType.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4" style={{ color: '#666666' }}>
                  {selectedType.desc.split('.')[0]}.
                </p>

                <div className="space-y-2 text-sm" style={{ color: '#666666' }}>
                  <div className="flex gap-2">
                    <span className="label shrink-0" style={{ color: '#0099ff' }}>Miedo básico:</span>
                    <span>{selectedType.coreFear}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="label shrink-0" style={{ color: '#0099ff' }}>Deseo básico:</span>
                    <span>{selectedType.coreDesire}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div className="flex gap-4 text-xs" style={{ color: '#a3a3a3' }}>
                    <span>✅ Integración → {TYPES.find(t => t.id === selectedType.growth)?.title}</span>
                    <span>⚠️ Estrés → {TYPES.find(t => t.id === selectedType.stress)?.title}</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="card p-8 text-center flex items-center justify-center" style={{ minHeight: '200px' }}>
                <div>
                  <span className="text-4xl block mb-3">👆</span>
                  <p className="text-sm" style={{ color: '#a3a3a3' }}>
                    Haz clic en un número del Eneagrama para ver su perfil
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Type grid */}
      <motion.div {...fadeUp} className="mt-12 max-w-4xl mx-auto">
        <h4 className="label mb-4 text-center">Los 9 eneatipos</h4>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              className="card p-3 text-center transition-all duration-200"
              style={{
                background: selected === t.id ? '#f5f5f5' : '#FFFFFF',
                borderColor: selected === t.id ? '#0099ff' : 'rgba(0,0,0,0.06)',
              }}
            >
              <span className="block text-lg">{t.emoji}</span>
              <span className="label text-[0.55rem]">{t.id}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
