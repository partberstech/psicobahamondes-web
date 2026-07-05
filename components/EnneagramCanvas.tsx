'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnneagramCanvasProps {
  scores: number[]
  size?: number
  onTypeSelect?: (type: number) => void
}

const TYPE_NAMES = [
  'Reformador', 'Ayudador', 'Triunfador', 'Individualista',
  'Investigador', 'Leal', 'Entusiasta', 'Desafiador', 'Pacificador'
]

const spring = [0.32, 0.72, 0, 1]

export default function EnneagramCanvas({ scores, size = 400, onTypeSelect }: EnneagramCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredType, setHoveredType] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [animatedIn, setAnimatedIn] = useState(false)
  const animProgress = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Entrance animation
    const startTime = performance.now()
    const duration = 1200

    const animate = (now: number) => {
      const elapsed = now - startTime
      animProgress.current = Math.min(1, elapsed / duration)
      if (animProgress.current < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setAnimatedIn(true)
      }
      drawDiagram(animProgress.current)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scores, size])

  useEffect(() => {
    if (animatedIn) drawDiagram(1)
  }, [animatedIn, hoveredType])

  const drawDiagram = (progress: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.scale(dpr, dpr)

    const center = size / 2
    const radius = size / 3
    const angleStep = 360 / 9

    ctx.clearRect(0, 0, size, size)

    // Draw circle with animation
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(center, center, radius * progress, 0, 2 * Math.PI * progress)
    ctx.stroke()

    if (progress < 0.3) return

    // Draw connecting lines (stress/growth pairs)
    const pairs = [
      [1, 4], [1, 7], [2, 4], [2, 8], [3, 6], [3, 9], [5, 7], [5, 8], [6, 9]
    ]

    ctx.strokeStyle = 'rgba(0,0,0,0.04)'
    ctx.lineWidth = 1
    for (const [a, b] of pairs) {
      const angleA = 90 - angleStep * a
      const angleB = 90 - angleStep * b
      const x1 = center + radius * Math.cos(-angleA * Math.PI / 180)
      const y1 = center + radius * Math.sin(-angleA * Math.PI / 180)
      const x2 = center + radius * Math.cos(-angleB * Math.PI / 180)
      const y2 = center + radius * Math.sin(-angleB * Math.PI / 180)

      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
    }

    // Draw type points with animation
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    const range = maxScore - minScore || 1

    for (let i = 0; i < 9; i++) {
      const angle = -(i * angleStep) + 50
      const x = center + radius * Math.cos(-angle * Math.PI / 180)
      const y = center + radius * Math.sin(-angle * Math.PI / 180)

      const normalized = (scores[i] - minScore) / range
      const isHovered = hoveredType === i + 1

      // Dot with animation
      const dotSize = (6 + normalized * 6) * progress
      const baseColor = isHovered ? '#2563eb' : `rgb(${Math.round(24 - normalized * 24)}, ${Math.round(36 - normalized * 10)}, ${Math.round(53 + normalized * 200)})`

      ctx.fillStyle = baseColor
      ctx.globalAlpha = progress
      ctx.beginPath()
      ctx.arc(x, y, dotSize, 0, 2 * Math.PI)
      ctx.fill()

      // Type number
      ctx.fillStyle = '#ffffff'
      ctx.font = `600 ${isHovered ? 11 : 10}px Inter, system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(i + 1), x, y)

      // Score percentage
      ctx.fillStyle = 'rgba(0,0,0,0.35)'
      ctx.font = '400 9px Inter, system-ui, sans-serif'
      ctx.fillText(`${scores[i]}%`, x, y + dotSize + 12)

      ctx.globalAlpha = 1
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const center = size / 2
    const radius = size / 3
    const angleStep = 360 / 9

    let closestType = null
    let closestDist = Infinity

    for (let i = 0; i < 9; i++) {
      const angle = -(i * angleStep) + 50
      const px = center + radius * Math.cos(-angle * Math.PI / 180)
      const py = center + radius * Math.sin(-angle * Math.PI / 180)
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2)

      if (dist < 25 && dist < closestDist) {
        closestDist = dist
        closestType = i + 1
      }
    }

    setHoveredType(closestType)
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleClick = () => {
    if (hoveredType && onTypeSelect) {
      onTypeSelect(hoveredType)
    }
  }

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredType(null)}
        onClick={handleClick}
        style={{
          width: size,
          height: size,
          display: 'block',
          cursor: hoveredType ? 'pointer' : 'default',
        }}
      />
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredType && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute pointer-events-none z-10 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 40,
              transform: 'translateX(-50%)',
              background: '#242424',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            Tipo {hoveredType}: {TYPE_NAMES[hoveredType - 1]}
            <span className="ml-1 opacity-60">({scores[hoveredType - 1]}%)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
