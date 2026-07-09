'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TestRapido from './TestRapido'
import TestRheti from './TestRheti'
import EneagramaExplorador from './EneagramaExplorador'
import { TYPES } from './enneagrama-data'

const spring = [0.32, 0.72, 0, 1]

// Iconos SVG premium con más detalle
function IconBolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      <circle cx="12" cy="12" r="10" strokeDasharray="4 2" opacity="0.3" />
    </svg>
  )
}

function IconList() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      <circle cx="3" cy="6" r="1" fill="currentColor" />
      <circle cx="3" cy="12" r="1" fill="currentColor" />
      <circle cx="3" cy="18" r="1" fill="currentColor" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
      <path d="M7 7l4 4M17 7l-4 4M7 17l4-4M17 17l-4-4" opacity="0.3" />
    </svg>
  )
}

function IconInfo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
      <path d="M8 12h8" opacity="0.3" />
    </svg>
  )
}

const SUB_TABS = [
  { id: 'explorar', label: 'Explorar Tipos', desc: 'Conoce los 9 eneatipos', icon: IconInfo, gradient: 'from-blue-50 to-indigo-50' },
  { id: 'rapido', label: 'Test Rápido', desc: '8 preguntas', icon: IconBolt, gradient: 'from-amber-50 to-orange-50' },
  { id: 'rheti', label: 'RHETI Completo', desc: '144 preguntas', icon: IconList, gradient: 'from-emerald-50 to-teal-50' },
  { id: 'diagrama', label: 'Diagrama', desc: 'Explorador interactivo', icon: IconGrid, gradient: 'from-purple-50 to-pink-50' },
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

      {/* Sub-tabs premium */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {SUB_TABS.map((tab) => {
          const isActive = subTab === tab.id
          const Icon = tab.icon
          return (
            <motion.button
              key={tab.id}
              onClick={() => { setSubTab(tab.id); setSelectedType(null) }}
              className="text-left transition-all"
              style={{
                padding: '20px',
                background: isActive ? '#ffffff' : '#f9fafb',
                border: isActive ? '2px solid #2563eb' : '2px solid rgba(0,0,0,0.04)',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: isActive ? '0 8px 24px rgba(37,99,235,0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
              }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(37,99,235,0.15)' }}
              transition={{ duration: 0.2, ease: spring }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ 
                background: isActive ? '#eff6ff' : '#f3f4f6',
                color: isActive ? '#2563eb' : '#9ca3af'
              }}>
                <Icon />
              </div>
              <span className="block text-sm font-semibold mb-1" style={{ fontFamily: 'var(--font-display)', color: isActive ? '#111827' : '#374151' }}>
                {tab.label}
              </span>
              <span className="block text-xs" style={{ color: '#9ca3af' }}>{tab.desc}</span>
            </motion.button>
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
                /* Grid de tipos premium */
                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  {TYPES_FULL.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className="text-left p-6 transition-all"
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(0,0,0,0.06)',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      }}
                      whileHover={{ 
                        y: -4, 
                        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                        borderColor: type.centerColor,
                      }}
                      transition={{ duration: 0.2, ease: spring }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{type.emoji}</span>
                        <div>
                          <span className="block text-xs font-bold" style={{ color: '#111827' }}>Tipo {type.id}</span>
                          <span className="block text-sm font-semibold" style={{ color: '#374151', fontFamily: 'var(--font-display)' }}>{type.title}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: type.centerColor }} />
                        <span className="text-xs" style={{ color: '#9ca3af' }}>{type.center}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                /* Detalle del tipo premium */
                <div>
                  <button onClick={() => setSelectedType(null)} className="btn btn-ghost text-sm mb-6" style={{ color: '#2563eb' }}>
                    ← Volver a tipos
                  </button>
                  {(() => {
                    const type = TYPES_FULL.find(t => t.id === selectedType)
                    if (!type) return null
                    return (
                      <div className="max-w-3xl">
                        <div className="flex items-center gap-5 mb-8">
                          <span className="text-5xl">{type.emoji}</span>
                          <div>
                            <h3 className="text-3xl font-bold" style={{ color: '#111827', fontFamily: 'var(--font-display)' }}>Tipo {type.id}: {type.title}</h3>
                            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full mt-2" style={{ background: `${type.centerColor}15`, color: type.centerColor }}>
                              <span className="w-2 h-2 rounded-full" style={{ background: type.centerColor }} />
                              Centro {type.center}
                            </span>
                          </div>
                        </div>

                        <p className="text-base leading-relaxed mb-8" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>{type.overview}</p>

                        {/* Miedo y Deseo */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', border: '1px solid rgba(239,68,68,0.1)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                              </svg>
                              <span className="label" style={{ color: '#dc2626' }}>Miedo Central</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{type.coreFear}</p>
                          </div>
                          <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', border: '1px solid rgba(34,197,94,0.1)' }}>
                            <div className="flex items-center gap-2 mb-2">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                              </svg>
                              <span className="label" style={{ color: '#16a34a' }}>Deseo Central</span>
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{type.coreDesire}</p>
                          </div>
                        </div>

                        {/* Estrés y Crecimiento */}
                        <div className="p-6 rounded-xl mb-8" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <span className="label mb-4 block">Estrés y Crecimiento</span>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#fef2f2' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M10 9l-6 6 6 6" />
                                  <path d="M20 4v7a4 4 0 0 1-4 4H4" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-sm font-semibold" style={{ color: '#dc2626' }}>Estrés → Tipo {type.stress.type}</span>
                                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{type.stress.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 9l6-6-6-6" />
                                  <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                                </svg>
                              </div>
                              <div>
                                <span className="text-sm font-semibold" style={{ color: '#16a34a' }}>Crecimiento → Tipo {type.growth.type}</span>
                                <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{type.growth.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Alas */}
                        <div className="p-6 rounded-xl mb-8" style={{ background: '#f9fafb', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <span className="label mb-4 block">Alas</span>
                          <div className="space-y-3">
                            {type.wings.map((wing, i) => (
                              <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#eff6ff' }}>
                                  <span className="text-xs font-bold" style={{ color: '#2563eb' }}>{i + 1}</span>
                                </div>
                                <p className="text-sm" style={{ color: '#4b5563' }}>{wing}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Fortalezas y Desafíos */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #eff6ff 100%)', border: '1px solid rgba(37,99,235,0.1)' }}>
                            <span className="label mb-4 block" style={{ color: '#2563eb' }}>Fortalezas</span>
                            <div className="space-y-2">
                              {type.strengths.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6L9 17l-5-5" />
                                  </svg>
                                  <span className="text-sm" style={{ color: '#4b5563' }}>{s}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-5 rounded-xl" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)', border: '1px solid rgba(234,88,12,0.1)' }}>
                            <span className="label mb-4 block" style={{ color: '#ea580c' }}>Desafíos</span>
                            <div className="space-y-2">
                              {type.challenges.map((c, i) => (
                                <div key={i} className="flex items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                  </svg>
                                  <span className="text-sm" style={{ color: '#4b5563' }}>{c}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-center p-8" style={{ background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.04)' }}>
                          <p className="text-base mb-4" style={{ color: '#6b7280' }}>
                            ¿Te identificas con este tipo? Descúbrelo con el test.
                          </p>
                          <button onClick={() => setSubTab('rapido')} className="btn btn-primary">
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
