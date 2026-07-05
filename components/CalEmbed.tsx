'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

type Modalidad = 'sesion-cero' | 'consulta-presencial' | 'consulta-telematica'

const CALENDAR_URLS: Record<Modalidad, string> = {
  'sesion-cero': 'https://cal.com/alejandro-rojas-verdugo-sd839u/sesion-cero?embed=true',
  'consulta-presencial': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-presencial?embed=true',
  'consulta-telematica': 'https://cal.com/alejandro-rojas-verdugo-sd839u/consulta-telematica?embed=true',
}

const MODALIDADES: Modalidad[] = ['sesion-cero', 'consulta-presencial', 'consulta-telematica']

const ETIQUETAS: Record<Modalidad, string> = {
  'sesion-cero': 'Sesión Cero (15 min)',
  'consulta-presencial': 'Consulta Presencial (50 min)',
  'consulta-telematica': 'Consulta Telemática (50 min)',
}

export default function CalEmbed() {
  const [modalidad, setModalidad] = useState<Modalidad>('sesion-cero')

  return (
    <div className="space-y-6">
      {/* Tabs selector de modalidad */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: '#f3f4f6' }}>
        {MODALIDADES.map((m) => {
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
              {ETIQUETAS[m]}
            </button>
          )
        })}
      </div>

      {/* Iframe embebido — recarga al cambiar modalidad */}
      <motion.div
        key={modalidad}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="w-full rounded-xl overflow-hidden"
        style={{ minHeight: '650px', background: '#f9fafb' }}
      >
        <iframe
          src={CALENDAR_URLS[modalidad]}
          width="100%"
          height="650px"
          style={{ border: 'none' }}
          title="Agendar consulta"
          allow="calendar"
        />
      </motion.div>
    </div>
  )
}
