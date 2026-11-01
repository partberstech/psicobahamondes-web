'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

/** Barra fina de progreso de lectura anclada al borde superior. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: '0% 50%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 60,
        background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 55%, #a855f7 100%)',
      }}
    />
  )
}
