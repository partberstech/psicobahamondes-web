'use client'

import { useEffect, useRef } from 'react'

interface RorschachCanvasProps {
  seed?: number
  width?: number
  height?: number
}

/**
 * RorschachCanvas — Manchas fractales de Rorschach.
 * Usa Julia Set como base de forma, aplica simetría horizontal,
 * y anima el parámetro `c` del fractal para morphing continuo.
 * Resultado: formas infinitamente detalladas, orgánicas, que respiran.
 */
export default function RorschachCanvas({
  seed = 42,
  width = 500,
  height = 400,
}: RorschachCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const p5Ref = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || p5Ref.current) return

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.11.3/p5.min.js'
    script.onload = () => {
      const p5Lib = (window as any).p5
      if (!p5Lib) return

      const sketch = (p: any) => {
        let t = 0
        const MAX_ITER = 60
        const SCALE = Math.min(width, height) * 0.45
        const centerX = width / 2
        const centerY = height / 2

        p.setup = () => {
          p.createCanvas(width, height)
          p.pixelDensity(1)
          p.colorMode(p.RGB, 255, 255, 255, 255)
          p.frameRate(30)
        }

        p.draw = () => {
          t += 0.012
          p.loadPixels()

          // Animated Julia set parameter — orbits slowly
          // Creates organic, breathing fractal shapes
          const cx = -0.7 + Math.sin(t * 0.7) * 0.15
          const cy = Math.cos(t * 0.5) * 0.25

          for (let px = 0; px < width; px++) {
            for (let py = 0; py < height; py++) {
              // Map pixel to complex plane
              const x0 = (px - centerX) / SCALE
              const y0 = (py - centerY) / SCALE

              let zx = x0
              let zy = y0
              let iter = 0

              // Julia set iteration
              while (zx * zx + zy * zy < 4 && iter < MAX_ITER) {
                const xtemp = zx * zx - zy * zy + cx
                zy = 2 * zx * zy + cy
                zx = xtemp
                iter++
              }

              // Create inkblot density from iteration count
              const dist = Math.sqrt(zx * zx + zy * zy)
              const smoothIter = iter + 1 - Math.log2(Math.log2(dist + 1) + 1)
              const normalized = smoothIter / MAX_ITER

              // Distance from center (for radial fade)
              const dx = (px - centerX) / (width * 0.45)
              const dy = (py - centerY) / (height * 0.45)
              const radialDist = Math.sqrt(dx * dx + dy * dy)

              // Symmetry: mirror horizontally
              const mirrorPx = width - px
              const mirrorDx = (mirrorPx - centerX) / (width * 0.45)
              const mirrorDist = Math.sqrt(mirrorDx * mirrorDx + dy * dy)
              const avgDist = (radialDist + mirrorDist) / 2

              // Ink density: fractal detail + radial fade
              const inkDensity = normalized * Math.max(0, 1 - avgDist * 0.8)

              // Threshold for inkblot — creates organic edge
              const threshold = 0.3 + Math.sin(t * 0.3) * 0.05

              let r = 255, g = 255, b = 255, a = 255

              if (inkDensity > threshold) {
                // Inside the inkblot
                const darkness = Math.min(1, (inkDensity - threshold) * 3)
                const intensity = Math.floor(20 + darkness * 15)

                // Subtle red tint on some areas (like Rorschach cards II/III)
                const redInfluence = Math.sin(px * 0.03 + py * 0.02 + t) * 0.5 + 0.5
                if (redInfluence > 0.8 && inkDensity > 0.5) {
                  r = Math.floor(intensity + 20)
                  g = Math.floor(intensity - 5)
                  b = Math.floor(intensity - 5)
                } else {
                  r = g = b = intensity
                }
              }

              // Pixel index
              const idx = 4 * (py * width + px)
              p.pixels[idx] = r
              p.pixels[idx + 1] = g
              p.pixels[idx + 2] = b
              p.pixels[idx + 3] = a
            }
          }

          p.updatePixels()
        }
      }

      p5Ref.current = new p5Lib(sketch, containerRef.current)
    }

    document.head.appendChild(script)

    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove()
        p5Ref.current = null
      }
    }
  }, [seed, width, height])

  return (
    <div ref={containerRef} className="flex justify-center" />
  )
}
