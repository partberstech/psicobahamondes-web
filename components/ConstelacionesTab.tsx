'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const spring = [0.32, 0.72, 0, 1]

const GALLERY_IMAGES = [
  { src: '/images/constelaciones-1.jpeg', alt: 'Constelaciones Familiares - sesión terapéutica', title: 'El espacio terapéutico' },
  { src: '/images/constelaciones-2.jpeg', alt: 'Constelaciones Familiares - dinámica grupal', title: 'La sanación en comunidad' },
  { src: '/images/constelaciones-3.jpeg', alt: 'Constelaciones Familiares - representación sistémica', title: 'Los lazos invisibles' },
  { src: '/images/constelaciones-4.jpeg', alt: 'Constelaciones Familiares - integración', title: 'Conexión y reconciliación' },
]

const FAQ = [
  { q: '¿Qué son las Constelaciones Familiares?', r: 'Un enfoque terapéutico que visibiliza dinámicas sistémicas ocultas dentro del sistema familiar. A través de una representación espacial, emergen lealtades invisibles y patrones que se repiten entre generaciones.' },
  { q: '¿Cuánto dura una sesión?', r: 'Una sesión individual dura aproximadamente 60 a 90 minutos. En sesiones grupales, el tiempo varía según el número de participantes.' },
  { q: '¿Se necesita preparación previa?', r: 'No. Solo llegar con una intención o tema que quieras trabajar. El facilitador guiará todo el proceso.' },
  { q: '¿Es compatible con otros tipos de terapia?', r: 'Sí, las constelaciones familiares complementan otros enfoques terapéuticos como psicoterapia individual, coaching o neuropsicología.' },
]

/* ── Icons ── */
function IconEye() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconRefresh() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
  )
}

function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

/* ── Lightbox ── */
function Lightbox({ images, index, onClose, onPrev, onNext }: {
  images: typeof GALLERY_IMAGES; index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <motion.img
          key={index}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3, ease: spring }}
          src={images[index].src}
          alt={images[index].alt}
          className="w-full h-auto"
          style={{ borderRadius: '12px' }}
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm" style={{ color: '#9ca3af', fontFamily: 'var(--font-body)' }}>{images[index].title}</p>
          <div className="flex gap-2">
            {index > 0 && (
              <button onClick={onPrev} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>← Anterior</button>
            )}
            {index < images.length - 1 && (
              <button onClick={onNext} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '0.75rem' }}>Siguiente →</button>
            )}
          </div>
        </div>
      </div>
      <button onClick={onClose} className="fixed top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full text-white cursor-pointer" style={{ background: 'rgba(255,255,255,0.15)', border: 'none', fontSize: '1.5rem' }}>✕</button>
    </motion.div>
  )
}

/* ── FAQ Item ── */
function FAQItem({ q, r }: { q: string; r: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between gap-3 w-full py-4 text-left cursor-pointer"
        style={{ background: 'none', border: 'none', fontFamily: 'var(--font-display)' }}
      >
        <span className="text-sm font-semibold" style={{ color: '#111827' }}>{q}</span>
        <span className="text-xs shrink-0" style={{ color: '#9ca3af', transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 200ms' }}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: spring }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{r}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── MAIN ── */
export default function ConstelacionesTab() {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring }}
        className="max-w-2xl mb-10"
      >
        <h2 className="mb-4" style={{ color: '#111827' }}>Constelaciones Familiares</h2>
        <p className="text-base leading-relaxed" style={{ color: '#4b5563', fontFamily: 'var(--font-body)' }}>
          Un enfoque terapéutico que revela las dinámicas invisibles de tu historia
          familiar. Los patrones que repites no son casualidad — son lealtades
          sistémicas que puedes sanar.
        </p>
      </motion.div>

      {/* Benefits — bento grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: spring, delay: 0.1 }}
        className="mb-10"
      >
        <span className="label mb-5 block">Qué puedes lograr</span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: IconEye, title: 'Visibilización', desc: 'Revela patrones ocultos en tu sistema familiar que influyen en tu vida actual' },
            { icon: IconRefresh, title: 'Sanación', desc: 'Rompe ciclos repetitivos entre generaciones y libera lo que no te pertenece' },
            { icon: IconHeart, title: 'Reconciliación', desc: 'Fortalece vínculos y encuentra paz con tu historia y tus raíces' },
          ].map((b, i) => (
            <div key={i} className="p-5" style={{ background: '#f9fafb', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)' }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <b.icon />
              </div>
              <h4 className="text-sm font-semibold mb-1.5" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>{b.title}</h4>
              <p className="text-xs leading-relaxed" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gallery — asymmetric grid */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-10"
      >
        <span className="label mb-5 block">Galería</span>
        <div className="grid grid-cols-2 gap-3" style={{ gridTemplateRows: 'auto' }}>
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className="group relative overflow-hidden"
              style={{
                aspectRatio: i === 0 ? '3/4' : i === 3 ? '4/3' : '1/1',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '1px solid rgba(0,0,0,0.04)',
                gridColumn: i === 0 ? 'span 1' : undefined,
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-medium" style={{ fontFamily: 'var(--font-body)' }}>{img.title}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={GALLERY_IMAGES}
            index={lightbox}
            onClose={() => setLightbox(null)}
            onPrev={() => setLightbox(lightbox - 1)}
            onNext={() => setLightbox(lightbox + 1)}
          />
        )}
      </AnimatePresence>

      {/* FAQ — clean lines */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="mb-10 max-w-2xl"
      >
        <span className="label mb-5 block">Preguntas frecuentes</span>
        <div>
          {FAQ.map((item, i) => (
            <FAQItem key={i} q={item.q} r={item.r} />
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: spring }}
        className="text-center py-10"
      >
        <h3 className="text-lg font-semibold mb-3" style={{ fontFamily: 'var(--font-display)', color: '#111827' }}>¿Quieres explorar tus vínculos?</h3>
        <p className="text-sm mb-6" style={{ color: '#6b7280', fontFamily: 'var(--font-body)' }}>
          En una Sesión Cero gratuita, conversamos sobre tu historia familiar
          y diseñamos un proceso terapéutico a tu medida.
        </p>
        <a href="/contacto" className="btn btn-primary">
          Agendar Sesión Cero
        </a>
      </motion.div>
    </div>
  )
}
