'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const spring = [0.32, 0.72, 0, 1]

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: spring }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div
            className="mx-auto max-w-3xl rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4"
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <div className="flex-1 text-sm leading-relaxed" style={{ color: '#4b5563' }}>
              Este sitio utiliza cookies solo para fines estadísticos y de funcionamiento. No usamos cookies de rastreo publicitario.{' '}
              <Link
                href="/politica-de-cookies"
                className="font-medium underline"
                style={{ color: '#2563eb' }}
                onClick={() => setVisible(false)}
              >
                Más información
              </Link>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={reject}
                className="text-sm font-medium px-4 py-2 rounded-full transition-all duration-300"
                style={{ color: '#6b7280' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Rechazar
              </button>
              <button
                onClick={accept}
                className="text-sm font-semibold px-5 py-2 rounded-full transition-all duration-300"
                style={{
                  background: '#2563eb',
                  color: '#fff',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2563eb')}
              >
                Aceptar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
