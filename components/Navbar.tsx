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

  return (
    <>
      {/* Floating Glass Pill — soft-skill §5.A */}
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

          {/* Hamburger — morph to X */}
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

      {/* Mobile fullscreen overlay — soft-skill §5.A */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: spring }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
            }}
          >
            <div className="flex flex-col items-center gap-2">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: spring, delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="block text-2xl font-bold py-3 px-8 rounded-2xl transition-colors duration-300"
                    style={{ color: '#242424' }}
                    onClick={() => setOpen(false)}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.5, ease: spring, delay: links.length * 0.06 }}
                className="mt-4"
              >
                <Link
                  href="/contacto"
                  className="btn btn-primary"
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
