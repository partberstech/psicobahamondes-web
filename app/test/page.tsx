'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import EneagramaTab from '@/components/EneagramaTab'
import ConstelacionesTab from '@/components/ConstelacionesTab'
import NeuropsicologiaTab from '@/components/NeuropsicologiaTab'

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

/* ── Tab descriptions — methodology context ── */
const TAB_DESCRIPTIONS: Record<string, { title: string; text: string }> = {
  eneagrama: {
    title: 'Eneagrama — Tu mapa interior',
    text: 'El Eneagrama es un modelo clínico-espiritual que identifica 9 patrones fundamentales de personalidad, cada uno gobernado por un miedo central y un deseo profundo. Dentro de nuestro enfoque integrativo, no se usa como etiqueta sino como herramienta de diagnóstico: revela los mecanismos de defensa automáticos que generan sufrimiento y abre la puerta a un trabajo terapéutico consciente. El test que utilizamos es el RETH (Riso-Hudson Enneagram Type System), un instrumento de 144 preguntas que cruza tres centros de inteligencia — Instintivo, Emocional y Mental — para determinar tu tipo base con precisión clínica.',
  },
  constelaciones: {
    title: 'Constelaciones Familiares — Lo invisible hecho visible',
    text: 'Las Constelaciones Familiares son un método fenomenológico que trabaja con la inteligencia del sistema familiar. En la práctica clínica, muchas de las dificultades que enfrentamos — relaciones repetitivas, bloqueos emocionales, patrones de auto-sabotaje — tienen su origen en lealtades invisibles y dinámicas transgeneracionales que no elegimos pero que nos habitan. A través de una representación espacial, el facilitador hace visible lo que está oculto: exclusiones, vínculos rotos, deudas afectivas entre generaciones. El objetivo no es juzgar a la familia sino recuperar el orden natural del sistema, liberar lo que no te pertenece y recuperar fuerza vital.',
  },
  neuropsicologia: {
    title: 'Neuropsicología — Entiende tu cerebro',
    text: 'La neuropsicología estudia la relación entre el cerebro y la conducta. Dentro de nuestra metodología, comprender tu cerebro no es un fin sino una herramienta terapéutica: identificar cómo funcionan tus procesos cognitivos — memoria, atención, funciones ejecutivas, regulación emocional — permite entender por qué piensas, sientes y actúas de cierta manera. Esta comprensión neurológica es la base para diseñar estrategias de cambio concretas: no se trata solo de "hablar de tus problemas" sino de reprogramar los circuitos cerebrales que los sostienen.',
  },
}

const tabs = [
  { id: 'eneagrama', label: 'Eneagrama', icon: IconEnneagram, desc: 'Conoce tu tipo de personalidad', color: '#2563eb' },
  { id: 'constelaciones', label: 'Constelaciones', icon: IconConstellations, desc: 'Sanar dinámicas familiares', color: '#8b5cf6' },
  { id: 'neuropsicologia', label: 'Neuropsicología', icon: IconBrain, desc: 'Entiende tu cerebro', color: '#059669' },
]

const TAB_COMPONENTS: Record<string, React.FC> = {
  eneagrama: EneagramaTab,
  constelaciones: ConstelacionesTab,
  neuropsicologia: NeuropsicologiaTab,
}

export default function TestPage() {
  const [activeTab, setActiveTab] = useState('eneagrama')
  const ActiveComponent = TAB_COMPONENTS[activeTab]
  const activeTabData = tabs.find(t => t.id === activeTab)
  const tabDesc = TAB_DESCRIPTIONS[activeTab]

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ minHeight: 'clamp(320px, 45vh, 480px)' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/Hero_Test.jpeg"
            alt="Test psicológicos - Psicobahamondes"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(17,24,39,0.75) 0%, rgba(17,24,39,0.45) 50%, rgba(17,24,39,0.15) 100%)',
          }} />
        </div>
        <div className="container-page relative z-10" style={{ paddingTop: 'clamp(140px, 22vh, 240px)', paddingBottom: 'clamp(60px, 10vh, 100px)' }}>
          <motion.div
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: spring }}
            className="max-w-2xl"
          >
            <span className="eyebrow mb-5" style={{ display: 'inline-flex', background: 'rgba(37,99,235,0.2)', color: '#93c5fd', border: '1px solid rgba(37,99,235,0.3)' }}>
              Test
            </span>
            <h1 className="mb-5" style={{ color: '#ffffff' }}>
              Herramientas que revelan tu proceso
            </h1>
            <p className="text-lg leading-relaxed max-w-xl" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-body)' }}>
              Tres instrumentos clínicos fundamentales: el Eneagrama para mapear tu personalidad,
              las Constelaciones Familiares para visibilizar dinámicas sistémicas, y la Neuropsicología
              para comprender los circuitos cerebrales que sostienen tu forma de vivir. Cada resultado
              alimenta tu proceso terapéutico.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TABS — Card Grid Layout ═══════ */}
      <section style={{ background: '#f9fafb', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container-page py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative flex flex-col items-center text-center p-5 transition-all"
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
                  <span className="block text-sm font-semibold mb-0.5" style={{ 
                    fontFamily: 'var(--font-display)', 
                    color: isActive ? tab.color : '#6b7280',
                    transition: 'color 200ms',
                  }}>
                    {tab.label}
                  </span>
                  <span className="block text-xs leading-tight" style={{ 
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

      {/* ═══════ TAB DESCRIPTION — Methodology Context ═══════ */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="container-page py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: spring }}
              className="max-w-3xl"
              style={{
                padding: '24px 28px',
                background: `linear-gradient(135deg, ${activeTabData?.color}06 0%, ${activeTabData?.color}02 100%)`,
                borderRadius: '16px',
                border: `1px solid ${activeTabData?.color}12`,
              }}
            >
              <h2 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>
                {tabDesc?.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
                {tabDesc?.text}
              </p>
            </motion.div>
          </AnimatePresence>
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
              Estos tests son una primera aproximación. En una{' '}
              <strong style={{ color: '#111827' }}>Sesión Cero</strong> gratuita de
              15 minutos, interpreto tus resultados y diseñamos juntos tu camino terapéutico.
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
