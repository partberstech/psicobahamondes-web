'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestRapido from './TestRapido'
import TestRheti from './TestRheti'
import EneagramaExplorador from './EneagramaExplorador'
import { TYPES } from './enneagrama-data'

const spring = [0.32, 0.72, 0, 1]

// Iconos SVG minimalistas
function IconBolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  )
}

const SUB_TABS = [
  { id: 'explorar', label: 'Explorar Tipos', desc: 'Conoce los 9 eneatipos', icon: IconInfo },
  { id: 'rapido', label: 'Test Rápido', desc: '8 preguntas', icon: IconBolt },
  { id: 'rheti', label: 'RHETI Completo', desc: '144 preguntas', icon: IconList },
  { id: 'diagrama', label: 'Diagrama', desc: 'Explorador interactivo', icon: IconGrid },
]

// Datos completos de los 9 tipos
const TYPES_FULL = [
  {
    id: 1, title: 'El Reformador', emoji: '🔹',
    center: 'Instintivo', centerColor: '#2563eb',
    overview: 'Principios, propósito y autodisciplina. Impulsados por el deseo profundo de ser buenos y mejorar el mundo. Tienen un fuerte crítico interior que los mantiene en estándares altos.',
    coreFear: 'Ser malo/a, defectuoso/a o corrupto/a',
    coreDesire: 'Ser bueno/a, íntegro/a y equilibrado/a',
    strengths: ['Integridad moral', 'Capacidad de mejora', 'Responsabilidad', 'Visión clara'],
    challenges: ['Autocrítica excesiva', 'Rigidez', 'Juicio hacia otros', 'Perfeccionismo'],
    stress: { type: 4, name: 'Hacia el Individualista' },
    growth: { type: 7, name: 'Hacia el Entusiasta' },
    wings: ['1w9 — El Idealista (más tranquilo, filosófico)', '1w2 — El Defensor (más cálido, orientado a personas)'],
  },
  {
    id: 2, title: 'El Ayudador', emoji: '💙',
    center: 'Emocional', centerColor: '#8b5cf6',
    overview: 'Cálido, generoso y atento a las necesidades de otros. Encuentran su valor siendo indispensables. Tienen una capacidad notable de percibir lo que otros necesitan antes de que lo pidan.',
    coreFear: 'No ser amado/a o no ser deseado/a',
    coreDesire: 'Sentirse amado/a y apreciado/a',
    strengths: ['Empatía profunda', 'Generosidad sincera', 'Conexión humana', 'Apoyo incondicional'],
    challenges: ['Descuido propio', 'Necesidad de aprobación', 'Orgullo encubierto', 'Dependencia emocional'],
    stress: { type: 8, name: 'Hacia el Desafiador' },
    growth: { type: 4, name: 'Hacia el Individualista' },
    wings: ['2w1 — El Asistente (más principioso, correcto)', '2w3 — El Anfitrión (más ambicioso, orientado a imagen)'],
  },
  {
    id: 3, title: 'El Triunfador', emoji: '🏆',
    center: 'Emocional', centerColor: '#8b5cf6',
    overview: 'Ambicioso, eficiente y orientado al logro. Se identifican con sus metas y temen el fracaso. Son maestros en adaptar su imagen al contexto para alcanzar el éxito.',
    coreFear: 'No tener valor, ser insignificante',
    coreDesire: 'Sentirse valioso/a y digno/a',
    strengths: ['Determinación', 'Capacidad de inspirar', 'Adaptabilidad', 'Excelencia'],
    challenges: ['Identificación con la imagen', 'Temor al fracaso', 'Competitividad', 'Desconexión emocional'],
    stress: { type: 9, name: 'Hacia el Pacificador' },
    growth: { type: 6, name: 'Hacia el Leal' },
    wings: ['3w2 — El Vendedor (más carismático, orientado a personas)', '3w4 — El Profesional (más creativo, introspectivo)'],
  },
  {
    id: 4, title: 'El Individualista', emoji: '🎨',
    center: 'Emocional', centerColor: '#8b5cf6',
    overview: 'Expresivo, sensible y profundamente conectado con su mundo emocional interior. Buscan comprenderse a sí mismos y ser comprendidos. Creativos y empáticos, a menudo sienten una nostalgia o que algo esencial falta.',
    coreFear: 'No tener identidad personal o significado',
    coreDesire: 'Encontrar su identidad e importancia',
    strengths: ['Creatividad profunda', 'Compasión', 'Honestidad emocional', 'Originalidad'],
    challenges: ['Melancolía', 'Autoabsorción', 'Envidia', 'Inestabilidad emocional'],
    stress: { type: 2, name: 'Hacia el Ayudador' },
    growth: { type: 1, name: 'Hacia el Reformador' },
    wings: ['4w3 — El Artista (más orientado a logros, adaptable)', '4w5 — El Bohemio (más introspectivo, analítico)'],
  },
  {
    id: 5, title: 'El Investigador', emoji: '🔍',
    center: 'Mental', centerColor: '#059669',
    overview: 'Perceptivo, analítico e intensamente privado. Motivados por el deseo de comprender el mundo profundamente y conservar sus recursos internos. Observan más de lo que participan.',
    coreFear: 'Ser inútil, incompetente o incapaz',
    coreDesire: 'Ser capaz y competente',
    strengths: ['Pensamiento visionario', 'Mente abierta', 'Independencia', 'Profundidad analítica'],
    challenges: ['Aislamiento', 'Retención', 'Desapego', 'Evitación emocional'],
    stress: { type: 7, name: 'Hacia el Entusiasta' },
    growth: { type: 8, name: 'Hacia el Desafiador' },
    wings: ['5w4 — El Iconoclasta (más creativo, individualista)', '5w6 — El Problema (más leal, orientado a seguridad)'],
  },
  {
    id: 6, title: 'El Leal', emoji: '🛡️',
    center: 'Mental', centerColor: '#059669',
    overview: 'Responsable, comprometido y orientado a la seguridad. Atentos al riesgo y a la confiabilidad de personas e instituciones. Leales a quienes confían y trabajadores dentro de sistemas que creen.',
    coreFear: 'No tener guía, apoyo o capacidad de sobrevivir',
    coreDesire: 'Tener seguridad y apoyo',
    strengths: ['Lealtad inquebrantable', 'Responsabilidad', 'Coraje real', 'Confianza'],
    challenges: ['Ansiedad', 'Desconfianza', 'Duda', 'Rebeldía'],
    stress: { type: 3, name: 'Hacia el Triunfador' },
    growth: { type: 9, name: 'Hacia el Pacificador' },
    wings: ['6w5 — El Defensor (más analítico, privado)', '6w7 — El Bufón (más sociable, optimista)'],
  },
  {
    id: 7, title: 'El Entusiasta', emoji: '⚡',
    center: 'Mental', centerColor: '#059669',
    overview: 'Entusiasta, espontáneo y orientado al futuro. Impulsados por el deseo de nuevas experiencias, ideas y posibilidades. Aportan energía y optimismo a todo lo que hacen.',
    coreFear: 'Estar en dolor o privación',
    coreDesire: 'Ser feliz y satisfecho',
    strengths: ['Optimismo contagioso', 'Versatilidad', 'Creatividad', 'Energía'],
    challenges: ['Dispersión', 'Evitación del dolor', 'Superficialidad', 'Impulsividad'],
    stress: { type: 1, name: 'Hacia el Reformador' },
    growth: { type: 5, name: 'Hacia el Investigador' },
    wings: ['7w6 — El Buddy (más leal, orientado a seguridad)', '7w8 — El Realizador (más asertivo, directo)'],
  },
  {
    id: 8, title: 'El Desafiador', emoji: '💪',
    center: 'Instintivo', centerColor: '#2563eb',
    overview: 'Poderoso, seguro de sí mismo y directo. Motivados por la necesidad de controlar sus propias vidas y resistir cualquier forma de debilidad o dominación. Se enfrentan al mundo con intensidad.',
    coreFear: 'Ser controlado, herido o violado por otros',
    coreDesire: 'Protegerse a sí mismo y a otros',
    strengths: ['Liderazgo natural', 'Determinación', 'Protección', 'Directo y honesto'],
    challenges: ['Dominación', 'Confrontación', 'Intimidación', 'Vulnerabilidad'],
    stress: { type: 5, name: 'Hacia el Investigador' },
    growth: { type: 2, name: 'Hacia el Ayudador' },
    wings: ['8w7 — El Pacificador (más sociable, espontáneo)', '8w9 — El Desafiador (más tranquilo, pacífico)'],
  },
  {
    id: 9, title: 'El Pacificador', emoji: '☮️',
    center: 'Instintivo', centerColor: '#2563eb',
    overview: 'Receptivo, tranquilo y pacificador. Motivados por el deseo profundo de armonía y la reluctancia a afirmarse de maneras que puedan causar conflicto. Tienen una notable capacidad de ver todos los lados.',
    coreFear: 'Pérdida y separación, desintegración',
    coreDesire: 'Paz interior y totalidad',
    strengths: ['Armonía', 'Estabilidad', 'Empatía', 'Mediación'],
    challenges: ['Complacencia', 'Evitación del conflicto', 'Pasividad', 'Indecisión'],
    stress: { type: 6, name: 'Hacia el Leal' },
    growth: { type: 3, name: 'Hacia el Triunfador' },
    wings: ['9w8 — El Refugiado (más asertivo, directo)', '9w4 — El Soñador (más creativo, introspectivo)'],
  },
]

export default function EneagramaTab() {
  const [subTab, setSubTab] = useState('explorar')
  const [selectedType, setSelectedType] = useState<number | null>(null)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring }}
        className="max-w-2xl mb-10"
      >
        <h2 className="mb-4" style={{ color: '#111827' }}>Eneagrama</h2>
        <p className="text-base leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          Un mapa de la personalidad con nueve patrones fundamentales. No es una
          etiqueta — es una herramienta para comprender tus mecanismos automáticos
          y recuperar la libertad de elegir.
        </p>
      </motion.div>

      {/* Sub-tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {SUB_TABS.map((tab) => {
          const isActive = subTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => { setSubTab(tab.id); setSelectedType(null) }}
              className="text-left transition-all"
              style={{
                padding: '16px',
                background: isActive ? '#eff6ff' : '#f9fafb',
                border: isActive ? '1.5px solid #2563eb' : '1.5px solid rgba(0,0,0,0.06)',
                borderRadius: '12px',
                cursor: 'pointer',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5" style={{ color: isActive ? '#2563eb' : '#6b7280' }}>
                <Icon />
                <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: isActive ? '#111827' : '#374151' }}>
                  {tab.label}
                </span>
              </div>
              <span className="text-xs" style={{ color: '#9ca3af' }}>{tab.desc}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={subTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: spring }}
        >
          {subTab === 'explorar' && (
            <div>
              {selectedType === null ? (
                /* Grid de tipos */
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  {TYPES_FULL.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className="text-left p-5 transition-all hover:shadow-md"
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                      }}
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{type.emoji}</span>
                        <div>
                          <span className="block text-xs font-bold" style={{ color: '#111827' }}>Tipo {type.id}</span>
                          <span className="block text-xs" style={{ color: '#6b7280' }}>{type.title}</span>
                        </div>
                      </div>
                      <span className="inline-block px-2 py-0.5 text-xs rounded" style={{ background: `${type.centerColor}15`, color: type.centerColor }}>
                        {type.center}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : (
                /* Detalle del tipo */
                <div>
                  <button onClick={() => setSelectedType(null)} className="btn btn-ghost text-sm mb-6" style={{ color: '#2563eb' }}>
                    ← Volver a tipos
                  </button>
                  {(() => {
                    const type = TYPES_FULL.find(t => t.id === selectedType)
                    if (!type) return null
                    return (
                      <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-4xl">{type.emoji}</span>
                          <div>
                            <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Tipo {type.id}: {type.title}</h3>
                            <span className="inline-block px-2 py-0.5 text-xs rounded mt-1" style={{ background: `${type.centerColor}15`, color: type.centerColor }}>
                              Centro {type.center}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#4b5563' }}>{type.overview}</p>

                        {/* Miedo y Deseo */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 rounded-lg" style={{ background: '#fef2f2', border: '1px solid rgba(239,68,68,0.1)' }}>
                            <span className="label mb-2 block" style={{ color: '#dc2626' }}>Miedo Central</span>
                            <p className="text-xs" style={{ color: '#6b7280' }}>{type.coreFear}</p>
                          </div>
                          <div className="p-4 rounded-lg" style={{ background: '#f0fdf4', border: '1px solid rgba(34,197,94,0.1)' }}>
                            <span className="label mb-2 block" style={{ color: '#16a34a' }}>Deseo Central</span>
                            <p className="text-xs" style={{ color: '#6b7280' }}>{type.coreDesire}</p>
                          </div>
                        </div>

                        {/* Estrés y Crecimiento */}
                        <div className="p-5 rounded-lg mb-6" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <span className="label mb-3 block">Estrés y Crecimiento</span>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-xs font-semibold" style={{ color: '#dc2626' }}>Estrés → Tipo {type.stress.type}</span>
                              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{type.stress.name}</p>
                            </div>
                            <div>
                              <span className="text-xs font-semibold" style={{ color: '#16a34a' }}>Crecimiento → Tipo {type.growth.type}</span>
                              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{type.growth.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* Alas */}
                        <div className="p-5 rounded-lg mb-6" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <span className="label mb-3 block">Alas</span>
                          <div className="space-y-2">
                            {type.wings.map((wing, i) => (
                              <p key={i} className="text-xs" style={{ color: '#6b7280' }}>{wing}</p>
                            ))}
                          </div>
                        </div>

                        {/* Fortalezas y Desafíos */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="p-4 rounded-lg" style={{ background: '#f0f7ff', border: '1px solid rgba(0,0,0,0.04)' }}>
                            <span className="label mb-3 block" style={{ color: '#2563eb' }}>Fortalezas</span>
                            {type.strengths.map((s, i) => (
                              <p key={i} className="text-xs mb-1" style={{ color: '#6b7280' }}>✦ {s}</p>
                            ))}
                          </div>
                          <div className="p-4 rounded-lg" style={{ background: '#fff7ed', border: '1px solid rgba(0,0,0,0.04)' }}>
                            <span className="label mb-3 block" style={{ color: '#ea580c' }}>Desafíos</span>
                            {type.challenges.map((c, i) => (
                              <p key={i} className="text-xs mb-1" style={{ color: '#6b7280' }}>◆ {c}</p>
                            ))}
                          </div>
                        </div>

                        <div className="text-center p-6" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <p className="text-sm mb-3" style={{ color: '#6b7280' }}>
                            ¿Te identificas con este tipo? Descúbrelo con el test.
                          </p>
                          <button onClick={() => setSubTab('rapido')} className="btn btn-primary text-sm">
                            Hacer test rápido
                          </button>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
          {subTab === 'rapido' && <TestRapido />}
          {subTab === 'rheti' && <TestRheti />}
          {subTab === 'diagrama' && <EneagramaExplorador />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
