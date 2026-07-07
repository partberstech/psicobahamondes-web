'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/blog', label: 'Contenidos' },
  { href: '/test', label: 'Test' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#111827', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <motion.div {...fadeUp}>
            <h4
              className="text-base font-bold mb-2"
              style={{ color: '#ffffff' }}
            >
              Psicobahamondes
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#9ca3af' }}
            >
              Ciencia para comprender, consciencia para sanar
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div {...fadeUp}>
            <h5 className="label mb-4" style={{ color: '#6b7280' }}>
              Navegación
            </h5>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-opacity hover:opacity-70"
                  style={{ color: '#d1d5db' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div {...fadeUp}>
            <h5 className="label mb-4" style={{ color: '#6b7280' }}>
              Contacto
            </h5>
            <div
              className="flex flex-col gap-2 text-sm"
              style={{ color: '#d1d5db' }}
            >
              <a href="mailto:contacto@psicobahamondes.cl" className="hover:underline">contacto@psicobahamondes.cl</a>
              <a href="tel:+56961599313" className="hover:underline">+56961599313</a>
              <span>Edificio Plaza Bühler, 6to piso, Av. Guillermo Bühler 2005</span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="my-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

        {/* Bottom bar */}
        <motion.div
          {...fadeUp}
          className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left"
        >
          <span className="text-xs" style={{ color: '#6b7280' }}>
            © {new Date().getFullYear()} Psicobahamondes. Todos los derechos reservados.
          </span>
          <Link
            href="/politica-de-cookies"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: '#6b7280' }}
          >
            Política de Cookies
          </Link>
        </motion.div>
      </div>
    </footer>
  )
}
