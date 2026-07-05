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
  { href: '/blog', label: 'Blog' },
  { href: '/recursos', label: 'Recursos' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#f5f5f5', borderTop: '1px solid rgba(34,42,53,0.08)' }}>
      <div className="container-page py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand */}
          <motion.div {...fadeUp}>
            <h4
              className="text-base font-bold mb-2"
              style={{ color: '#242424' }}
            >
              Psicobahamondes
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: '#898989' }}
            >
              Ciencia para comprender, consciencia para sanar
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div {...fadeUp}>
            <h5 className="label mb-4" style={{ color: '#a3a3a3' }}>
              Navegación
            </h5>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-opacity"
                  style={{ color: '#666666' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div {...fadeUp}>
            <h5 className="label mb-4" style={{ color: '#a3a3a3' }}>
              Contacto
            </h5>
            <div
              className="flex flex-col gap-2 text-sm"
              style={{ color: '#666666' }}
            >
              <span>contacto@psicobahamondes.cl</span>
              <span>+56 9 XXXX XXXX</span>
              <span>Santiago, Chile</span>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="divider my-10" />

        {/* Bottom bar */}
        <motion.div
          {...fadeUp}
          className="flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left"
        >
          <span className="text-xs" style={{ color: '#a3a3a3' }}>
            © {new Date().getFullYear()} Psicobahamondes. Todos los derechos reservados.
          </span>
        </motion.div>
      </div>
    </footer>
  )
}
