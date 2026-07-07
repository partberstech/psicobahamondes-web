'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.2, 0, 0, 1] },
}

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <div className="container-page max-w-3xl">
        <motion.div {...fadeUp}>
          <Link
            href="/"
            className="text-sm font-medium inline-block mb-6 transition-opacity hover:opacity-70"
            style={{ color: '#2563eb' }}
          >
            ← Volver al inicio
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#111827' }}>
            Política de Cookies
          </h1>
          <p className="text-sm mb-10" style={{ color: '#6b7280' }}>
            Última actualización: julio 2026
          </p>

          <div className="prose prose-sm max-w-none" style={{ color: '#374151' }}>
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                1. ¿Qué son las cookies?
              </h2>
              <p className="leading-relaxed mb-3">
                Las cookies son pequeños archivos de texto que los sitios web almacenan en tu navegador
                cuando los visitas. Permiten que el sitio recuerde tus preferencias y comportamiento
                durante un tiempo, para mejorar tu experiencia de navegación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                2. Tipos de cookies que utilizamos
              </h2>
              <p className="leading-relaxed mb-3">
                En <strong>Psicobahamondes</strong> utilizamos exclusivamente cookies técnicas y
                funcionales. No empleamos cookies de publicidad comportamental ni de rastreo de
                terceros con fines comerciales.
              </p>
              <ul className="list-disc pl-5 space-y-2 leading-relaxed">
                <li>
                  <strong>Cookies técnicas (necesarias):</strong> permiten el funcionamiento básico
                  del sitio, como recordar tu estado de consentimiento de cookies. Son esenciales
                  y no requieren tu consentimiento explícito.
                </li>
                <li>
                  <strong>Cookies de preferencias:</strong> recuerdan tus elecciones (como el
                  cierre del banner de cookies) para no mostrarlo repetidamente.
                </li>
                <li>
                  <strong>Cookies de análisis estadístico:</strong> utilizamos Vercel Analytics para
                  comprender el tráfico del sitio de forma anónima y agregada. No se almacena
                  información personal identificable.
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                3. Cookies de terceros
              </h2>
              <p className="leading-relaxed mb-3">
                Nuestra plataforma de despliegue (Vercel Inc.) puede recopilar datos anónimos de
                rendimiento y errores para garantizar la disponibilidad del sitio. Estos datos no
                se comparten con fines publicitarios ni se vinculan a tu identidad.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                4. Cómo gestionar las cookies
              </h2>
              <p className="leading-relaxed mb-3">
                Al visitar nuestro sitio por primera vez, se te presenta un banner de consentimiento
                donde puedes aceptar o rechazar las cookies no esenciales. Puedes cambiar tu
                preferencia en cualquier momento eliminando las cookies almacenadas desde la
                configuración de tu navegador.
              </p>
              <p className="leading-relaxed mb-3">
                También puedes configurar tu navegador para bloquear todas las cookies o para
                alertarte cada vez que se envíe una cookie. Los siguientes enlaces te indican
                cómo hacerlo en los navegadores más comunes:
              </p>
              <ul className="list-disc pl-5 space-y-1 leading-relaxed text-sm">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2563eb' }}>Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2563eb' }}>Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2563eb' }}>Safari</a></li>
                <li><a href="https://support.microsoft.com/es-es/windows/eliminar-y-administrar-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: '#2563eb' }}>Microsoft Edge</a></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                5. Base legal
              </h2>
              <p className="leading-relaxed mb-3">
                De acuerdo con la Ley 19.628 sobre Protección de la Vida Privada de Chile y el
                Reglamento General de Protección de Datos (RGPD) de la Unión Europea, tratamos los
                datos de navegación de forma minimizada y solo con tu consentimiento explícito
                para cookies no esenciales.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3" style={{ color: '#111827' }}>
                6. Contacto
              </h2>
              <p className="leading-relaxed mb-3">
                Si tienes dudas sobre esta política de cookies, puedes escribirnos a{' '}
                <a href="mailto:contacto@psicobahamondes.cl" className="underline" style={{ color: '#2563eb' }}>
                  contacto@psicobahamondes.cl
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
