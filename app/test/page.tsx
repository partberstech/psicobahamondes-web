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

/* ── Premium Icons ── */
function IconEnneagram({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v7M12 15v7M2 12h7M15 12h7" />
      <path d="M12 2l2 4M12 2l-2 4M12 22l2-4M12 22l-2-4M2 12l4 2M2 12l4-2M22 12l-4 2M22 12l-4-2" opacity="0.3" />
    </svg>
  )
}

function IconConstellations({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="7" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="7" cy="19" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M7 5l5 7M17 7l-5 5M12 14l-5 5M12 14l5 4" />
      <path d="M5 5l7 2M19 7l-7 5M12 12l-5 7M12 12l5 6" opacity="0.3" />
    </svg>
  )
}

function IconBrain({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 4.5 2.8A4 4 0 0 1 20 8.5a4.5 4.5 0 0 1-.8 8A3.5 3.5 0 0 1 16 20H8a3.5 3.5 0 0 1-3.2-3.5 4.5 4.5 0 0 1-.8-8A4 4 0 0 1 7.5 4.8 5 5 0 0 1 12 2z" />
      <path d="M12 2v20" />
      <path d="M8 6c2 1 4 1 6 0M8 12c2 1 4 1 6 0M8 18c2 1 4 1 6 0" opacity="0.3" />
    </svg>
  )
}

function IconInk({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9" />
      <path d="M12 2c3 0 5.5 4.5 5.5 10S15 22 12 22" />
      <path d="M12 2c-3 0-5.5 4.5-5.5 10S9 22 12 22" />
      <circle cx="18" cy="6" r="3" fill={active ? '#2563eb' : 'none'} />
      <path d="M12 2c-1.5 0-3 1.5-3 4s1.5 4 3 4 3-1.5 3-4-1.5-4-3-4z" opacity="0.3" />
    </svg>
  )
}

function IconChart({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M7 16l4-8 4 4 4-10" />
      <circle cx="7" cy="16" r="1.5" fill={active ? '#2563eb' : 'none'} />
      <circle cx="11" cy="8" r="1.5" fill={active ? '#2563eb' : 'none'} />
      <circle cx="15" cy="12" r="1.5" fill={active ? '#2563eb' : 'none'} />
      <circle cx="19" cy="2" r="1.5" fill={active ? '#2563eb' : 'none'} />
    </svg>
  )
}

function IconColors({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#2563eb' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v4M12 20v-4" />
      <path d="M5 12h4M15 12h4" />
      <path d="M8 8l3 3M13 13l3 3" />
      <circle cx="12" cy="12" r="3" fill={active ? '#2563eb' : 'none'} opacity="0.3" />
    </svg>
  )
}

const tabs = [
  { id: 'eneagrama', label: 'Eneagrama', icon: IconEnneagram, desc: 'Conoce tu tipo de personalidad', color: '#2563eb' },
  { id: 'constelaciones', label: 'Constelaciones', icon: IconConstellations, desc: 'Sanar dinámicas familiares', color: '#8b5cf6' },
  { id: 'neuropsicologia', label: 'Neuropsicología', icon: IconBrain, desc: 'Entiende tu cerebro', color: '#059669' },
  { id: 'rorschach', label: 'Rorschach', icon: IconInk, desc: 'Explora tu percepción', color: '#ea580c' },
  { id: 'bigfive', label: 'Big Five', icon: IconChart, desc: 'Los Cinco Grandes', color: '#dc2626' },
  { id: 'luscher', label: 'Lüscher', icon: IconColors, desc: 'Tu estado emocional', color: '#7c3aed' },
]

const TAB_COMPONENTS: Record<string, React.FC> = {
  eneagrama: EneagramaTab,
  constelaciones: ConstelacionesTab,
  neuropsicologia: NeuropsicologiaTab,
  rorschach: RorschachTest,
  bigfive: BigFiveTest,
  luscher: LuscherTest,
}

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('eneagrama')
  const ActiveComponent = TAB_COMPONENTS[activeTab]
  const activeTabData = tabs.find(t => t.id === activeTab)

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
            <span className="eyebrow mb-5">Test</span>
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

      {/* ═══════ TABS — Card Grid Layout ═══════ */}
      <section style={{ background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-page py-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center text-center p-4 transition-all"
                  style={{
                    background: isActive ? '#ffffff' : 'transparent',
                    border: isActive ? `2px solid ${tab.color}` : '2px solid transparent',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 8px 24px ${tab.color}20` : 'none',
                  }}
                  whileHover={{ 
                    y: -4, 
                    boxShadow: `0 12px 32px ${tab.color}25`,
                    background: isActive ? '#ffffff' : '#f3f4f6',
                  }}
                  transition={{ duration: 0.2, ease: spring }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-2" style={{ 
                    background: isActive ? `${tab.color}15` : '#f3f4f6',
                    transition: 'background 200ms',
                  }}>
                    <Icon active={isActive} />
                  </div>
                  <span className="block text-xs font-semibold mb-0.5" style={{ 
                    fontFamily: 'var(--font-display)', 
                    color: isActive ? tab.color : '#6b7280',
                    transition: 'color 200ms',
                  }}>
                    {tab.label}
                  </span>
                  <span className="block text-[10px] leading-tight" style={{ 
                    color: isActive ? '#9ca3af' : '#d1d5db',
                    transition: 'color 200ms',
                  }}>
                    {tab.desc}
                  </span>
                </motion.button>
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
