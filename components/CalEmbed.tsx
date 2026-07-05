'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Modalidad = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

const CALENDAR_LINKS = {
  'sesion-cero': 'alejandro-rojas-verdugo-sd839u/sesion-cero',
  'consulta-presencial': 'alejandro-rojas-verdugo-sd839u/consulta-presencial',
  'consulta-telematica': 'alejandro-rojas-verdugo-sd839u/consulta-telematica',
}

const getEventLabel = (modalidad: Modalidad): string => {
  switch (modalidad) {
    case 'sesion-cero':
      return 'Sesión Cero (15 min)'
    case 'consulta-presencial':
      return 'Consulta Presencial (50 min)'
    case 'consulta-telematica':
      return 'Consulta Telemática (50 min)'
    default:
      return modalidad
  }
}

export default function CalEmbed() {
  const [modalidad, setModalidad] = useState<Modalidad>('sesion-cero')

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Definir Cal como cola inmediatamente (patrón oficial Cal.com)
    ;(window as any).Cal = (window as any).Cal || function () {
      ((window as any).Cal.q = (window as any).Cal.q || []).push(arguments)
    }

    // 2. Configurar y colocar inline
    ;(window as any).Cal('init', { origin: 'https://cal.com' })
    ;(window as any).Cal('inline', {
      elementOrSelector: '#cal-inline-container',
      calLink: CALENDAR_LINKS[modalidad],
    })

    // 3. Cargar script (solo una vez)
    if (!document.querySelector('#cal-embed-script')) {
      const script = document.createElement('script')
      script.src = 'https://cal.com/embed.js'
      script.async = true
      script.id = 'cal-embed-script'
      document.head.appendChild(script)
    }

    return () => {
      const container = document.getElementById('cal-inline-container')
      if (container) container.innerHTML = ''
    }
  }, [modalidad])

  return (
    <div className="space-y-6">
      {/* Tabs de modalidad */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#f3f4f6' }}>
        {(['sesion-cero', 'consulta-presencial', 'consulta-telematica'] as Modalidad[]).map((m) => {
          const active = modalidad === m
          return (
            <button
              key={m}
              onClick={() => setModalidad(m)}
              className="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                background: active ? '#2563eb' : 'transparent',
                color: active ? '#ffffff' : '#6b7280',
                fontFamily: 'var(--font-body)',
              }}
            >
              {getEventLabel(m)}
            </button>
          )
        })}
      </div>

      {/* Embed container */}
      <motion.div
        key={modalidad}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        id="cal-inline-container"
        className="w-full rounded-xl overflow-hidden"
        style={{ minHeight: '600px', background: '#f9fafb' }}
      />
    </div>
  )
}