'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EneagramaTab from '@/components/EneagramaTab'
import ConstelacionesTab from '@/components/ConstelacionesTab'
import NeuropsicologiaTab from '@/components/NeuropsicologiaTab'
import RorschachTest from '@/components/RorschachTest'
import BigFiveTest from '@/components/BigFiveTest'
import LuscherTest from '@/components/LuscherTest'

const spring = [0.32, 0.72, 0, 1]

/* ── Minimalist Icons ── */
function IconEnneagram({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
    </svg>
  )
}

function IconConstellations({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M7 5l5 7M17 7l-5 5M12 14l-5 5M12 14l5 4" />
    </svg>
  )
}

function IconBrain({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 4.5 2.8A4 4 0 0 1 20 8.5a4.5 4.5 0 0 1-.8 8A3.5 3.5 0 0 1 16 20H8a3.5 3.5 0 0 1-3.2-3.5 4.5 4.5 0 0 1-.8-8A4 4 0 0 1 7.5 4.8 5 5 0 0 1 12 2z" />
      <path d="M12 2v20" />
    </svg>
  )
}

function IconInk({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9" />
      <path d="M12 2c3 0 5.5 4.5 5.5 10S15 22 12 22" />
      <path d="M12 2c-3 0-5.5 4.5-5.5 10S9 22 12 22" />
      <circle cx="18" cy="6" r="3" fill={active ? '#2563eb' : 'none'} />
    </svg>
  )
}

function IconChart({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-10" />
    </svg>
  )
}

function IconColors({ active }: { active?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M12 20v-4" />
      <path d="M5 12h4M15 12h4" />
      <path d="M8 8l3 3M13 13l3 3" />
    </svg>
  )
}

const tabs = [
  { id: 'eneagrama', label: 'Eneagrama', icon: IconEnneagram, desc: 'Conoce tu tipo de personalidad' },
  { id: 'constelaciones', label: 'Constelaciones', icon: IconConstellations, desc: 'Sanar dinámicas familiares' },
  { id: 'neuropsicologia', label: 'Neuropsicología', icon: IconBrain, desc: 'Entiende tu cerebro' },
  { id: 'rorschach', label: 'Rorschach', icon: IconInk, desc: 'Explora tu percepción' },
  { id: 'bigfive', label: 'Big Five', icon: IconChart, desc: 'Los Cinco Grandes' },
  { id: 'luscher', label: 'Lüscher', icon: IconColors, desc: 'Tu estado emocional' },
]

const TAB_COMPONENTS: Record<string, React.FC> = {
  eneagrama: EneagramaTab,
  constelaciones: ConstelacionesTab,
  neuropsicologia: NeuropsicologiaTab,
  rorschach: RorschachTest,
  bigfive: BigFiveTest,
  luscher: LuscherTest,
}

export default function RecursosPage() {
  const [activeTab, setActiveTab] = useState('eneagrama')
  const ActiveComponent = TAB_COMPONENTS[activeTab]

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="section-block pt-28 md:pt-36" style={{ background: '#f9fafb' }}>
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: spring }}
            className="max-w-2xl"
          >
            <span className="eyebrow mb-5">Recursos</span>
            <h1 className="mb-5" style={{ color: '#111827' }}>
              Descubre tu proceso
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
              Herramientas interactivas para explorar tu personalidad, comprender
              tus vínculos familiares, conocer cómo funciona tu cerebro y descubrir
              tu estado emocional actual. Cada resultado es una puerta a tu próxima sesión.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TAB BAR ═══════ */}
      <section style={{ background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-page">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex items-center gap-3 px-5 py-4 transition-all whitespace-nowrap"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <Icon active={isActive} />
                  <div className="text-left">
                    <span
                      className="block text-sm font-semibold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: isActive ? '#111827' : '#9ca3af',
                        transition: 'color 200ms',
                      }}
                    >
                      {tab.label}
                    </span>
                    <span
                      className="block text-xs mt-0.5"
                      style={{
                        fontFamily: 'var(--font-body)',
                        color: isActive ? '#6b7280' : '#d1d5db',
                        transition: 'color 200ms',
                      }}
                    >
                      {tab.desc}
                    </span>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: '#2563eb' }}
                      transition={{ duration: 0.3, ease: spring }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ TAB CONTENT ═══════ */}
      <section className="section-block" style={{ background: '#ffffff' }}>
        <div className="container-page">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: spring }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══════ CTA — Sesión Cero ═══════ */}
      <section className="section-block" style={{ background: '#f9fafb' }}>
        <div className="container-page text-center max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: spring }}
          >
            <span className="eyebrow mb-4">Siguiente paso</span>
            <h2 className="mb-4 mt-4" style={{ color: '#111827' }}>¿Quieres profundizar?</h2>
            <p className="text-base mb-8 leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
              Los tests son una primera aproximación. En una{' '}
              <strong style={{ color: '#111827' }}>Sesión Cero</strong> gratuita de
              15 minutos, interpreto tus resultados y diseñamos juntos tu camino.
            </p>
            <a href="/contacto" className="btn btn-primary" style={{ padding: '14px 36px' }}>
              Agendar Sesión Cero
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}