import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import WhatsAppButton from '@/components/WhatsAppButton'
import CookieConsent from '@/components/CookieConsent'

export const metadata: Metadata = {
  title: 'Psicobahamondes | Neuropsicología, Eneagrama y Constelaciones Familiares',
  description:
    'Pedro Bahamondes, psicólogo con más de 15 años de experiencia. Integramos neuropsicología, eneagrama y constelaciones familiares para sanar desde la raíz.',
  keywords: 'psicólogo, neuropsicología, eneagrama, constelaciones familiares, terapia online, consulta psicológica',
  metadataBase: new URL('https://psicobahamondes.cl'),
  openGraph: {
    title: 'Psicobahamondes | Neuropsicología, Eneagrama y Constelaciones Familiares',
    description:
      'Pedro Bahamondes, psicólogo con más de 15 años de experiencia. Integramos neuropsicología, eneagrama y constelaciones familiares.',
    url: 'https://psicobahamondes.cl',
    siteName: 'Psicobahamondes',
    locale: 'es_CL',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Psicobahamondes',
    description:
      'Pedro Bahamondes, psicólogo. Neuropsicología, Eneagrama y Constelaciones Familiares.',
    images: ['/api/og'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>" />
        <link rel="alternate" type="application/rss+xml" title="Psicobahamondes — Blog RSS" href="/api/rss" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  )
}
