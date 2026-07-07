'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchModal from './SearchModal'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/blog', label: 'Contenidos' },
  { href: '/test', label: 'Test' },
  { href: '/contacto', label: 'Contacto' },
]

const spring = [0.32, 0.72, 0, 1]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Floating Glass Pill */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: spring, delay: 0.3 }}
        className="fixed z-50 left-1/2 -translate-x-1/2"
        style={{
          top: scrolled ? '12px' : '20px',
          transition: 'top 500ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <nav
          className="flex items-center gap-1 px-2 py-2 rounded-full"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: scrolled
              ? '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)'
              : '0 2px 12px rgba(0,0,0,0.04)',
            transition: 'all 500ms cubic-bezier(0.32, 0.72, 0, 1)',
            maxWidth: 'calc(100vw - 24px)',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            className="text-sm font-bold tracking-tight px-4 py-2 shrink-0"
            style={{ color: '#242424' }}
          >
            Psicobahamondes
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 shrink-0">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-3 py-2 text-xs font-semibold rounded-full transition-all duration-300"
                style={{ color: '#666666' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#242424'
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#666666'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
            <SearchModal />
            <Link
              href="/contacto"
              className="btn btn-primary ml-2"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '8px 20px',
              }}
            >
              Consulta 0
            </Link>
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300"
            style={{ color: '#242424' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Menú"
          >
            <motion.div
              className="absolute"
              animate={{ rotate: open ? 45 : 0, y: open ? 0 : -4 }}
              transition={{ duration: 0.3, ease: spring }}
              style={{ width: 16, height: 2, background: '#242424', borderRadius: 1 }}
            />
            <motion.div
              className="absolute"
              animate={{ rotate: open ? -45 : 0, y: open ? 0 : 4 }}
              transition={{ duration: 0.3, ease: spring }}
              style={{ width: 16, height: 2, background: '#242424', borderRadius: 1 }}
            />
          </button>
        </nav>
      </motion.div>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: spring }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.3)' }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Slide-in drawer from right */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: spring }}
            className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col"
            style={{
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
            }}
          >
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-300"
                style={{ color: '#242424' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                aria-label="Cerrar menú"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 flex flex-col justify-center px-8 pb-16 gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.4, ease: spring, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="block text-xl font-bold py-3 px-4 rounded-xl transition-colors duration-300"
                    style={{ color: '#242424' }}
                    onClick={() => setOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <div className="px-8 pb-10">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: spring, delay: links.length * 0.05 }}
              >
                <Link
                  href="/contacto"
                  className="btn btn-primary w-full text-center block"
                  style={{ fontSize: '1rem', fontWeight: 600, padding: '14px 32px' }}
                  onClick={() => setOpen(false)}
                >
                  Consulta 0
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
