'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check, Loader2 } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'already'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@')) return

    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      
      if (data.alreadySubscribed) {
        setStatus('already')
      } else if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
          <Mail className="w-5 h-5 text-[#2563eb]" />
        </div>
        <div>
          <h3 className="font-['Plus_Jakarta_Sans',sans-serif] font-bold text-[#111827]">
            Newsletter
          </h3>
          <p className="text-xs text-[#6b7280]">Contenido semanal gratuito</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'success' || status === 'already' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 py-4"
          >
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-sm text-[#111827]">
              {status === 'already' ? 'Ya estás suscrito ✓' : '¡Suscripción exitosa! ✓'}
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                         focus:outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20
                         transition-colors font-['Source_Sans_3',sans-serif]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-3 rounded-xl bg-[#111827] text-white text-sm font-semibold
                         hover:bg-[#1f2937] transition-colors disabled:opacity-50
                         font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Suscribiendo...
                </span>
              ) : (
                'Suscribirme'
              )}
            </button>
            <p className="text-[11px] text-[#9ca3af] text-center">
              Sin spam. Cancela cuando quieras.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
