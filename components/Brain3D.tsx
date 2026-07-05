'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

interface Brain3DProps {
  width?: number
  height?: number
  onRegionClick?: (region: string) => void
}

// Regiones del cerebro con información y posiciones 3D aproximadas
const BRAIN_REGIONS = [
  { name: 'Corteza Prefrontal', desc: 'Toma de decisiones, personalidad, conducta social', color: '#2563eb', position: { x: 0, y: 0.3, z: 0.5 } },
  { name: 'Amígdala', desc: 'Procesamiento emocional, miedo y ansiedad', color: '#dc2626', position: { x: 0, y: -0.2, z: 0.2 } },
  { name: 'Hipocampo', desc: 'Memoria, aprendizaje y navegación espacial', color: '#059669', position: { x: 0, y: -0.1, z: -0.2 } },
  { name: 'Corteza Cingulada', desc: 'Regulación emocional y dolor', color: '#7c3aed', position: { x: 0, y: 0.2, z: 0 } },
  { name: 'Tallo Cerebral', desc: 'Funciones vitales: respiración, ritmo cardíaco', color: '#ea580c', position: { x: 0, y: -0.5, z: -0.3 } },
]

// Material base del cerebro
const BASE_MATERIAL = {
  color: 0x111827,
  wireframe: true,
  transparent: true,
  opacity: 0.3,
  side: THREE.DoubleSide,
}

export default function Brain3D({ width = 600, height = 400, onRegionClick }: Brain3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeRegion, setActiveRegion] = useState<number | null>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    brain: THREE.Group | null
    animationId: number
    originalMaterials: Map<THREE.Mesh, THREE.Material>
  } | null>(null)

  // Handle region selection — highlight the brain
  const handleRegionSelect = (index: number) => {
    const newRegion = activeRegion === index ? null : index
    setActiveRegion(newRegion)
    onRegionClick?.(newRegion !== null ? BRAIN_REGIONS[newRegion].name : '')

    // Update 3D model colors
    if (sceneRef.current?.brain) {
      const brain = sceneRef.current.brain
      const region = newRegion !== null ? BRAIN_REGIONS[newRegion] : null
      const targetColor = region ? new THREE.Color(region.color) : null

      brain.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mat = child.material as THREE.MeshPhongMaterial

          if (region) {
            // Highlight: blend between base color and region color
            mat.color.set(targetColor!)
            mat.opacity = 0.6
            mat.wireframe = false
          } else {
            // Reset to base
            mat.color.set(BASE_MATERIAL.color)
            mat.opacity = BASE_MATERIAL.opacity
            mat.wireframe = BASE_MATERIAL.wireframe
          }
        }
      })
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 1, 2000)
    camera.position.z = 300

    // Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    containerRef.current.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(100, 100, 100)
    scene.add(directionalLight)

    const backLight = new THREE.DirectionalLight(0x2563eb, 0.3)
    backLight.position.set(-100, -100, -100)
    scene.add(backLight)

    // Load brain model
    const loader = new OBJLoader()
    loader.load(
      '/models/BrainMesh.obj',
      (obj) => {
        const originalMaterials = new Map<THREE.Mesh, THREE.Material>()

        // Style the brain parts
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const mat = new THREE.MeshPhongMaterial({
              color: BASE_MATERIAL.color,
              wireframe: BASE_MATERIAL.wireframe,
              transparent: BASE_MATERIAL.transparent,
              opacity: BASE_MATERIAL.opacity,
              side: BASE_MATERIAL.side,
            })
            originalMaterials.set(child, child.material)
            child.material = mat
          }
        })

        // Scale and position
        obj.scale.set(5, 5, 5)
        obj.position.y = -20

        scene.add(obj)
        setIsLoaded(true)

        // Store reference
        sceneRef.current = {
          scene,
          camera,
          renderer,
          brain: obj,
          animationId: 0,
          originalMaterials,
        }
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = (xhr.loaded / xhr.total) * 100
          console.log(`Brain model: ${Math.round(percent)}% loaded`)
        }
      },
      (error) => {
        console.error('Error loading brain model:', error)
      }
    )

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1
      mouseY = (e.clientY / window.innerHeight) * 2 - 1
    }
    document.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let time = 0
    const animate = () => {
      const animationId = requestAnimationFrame(animate)
      time += 0.005

      // Subtle rotation
      if (sceneRef.current?.brain) {
        sceneRef.current.brain.rotation.y = Math.sin(time) * 0.3
        sceneRef.current.brain.rotation.x = mouseY * 0.1
        sceneRef.current.brain.rotation.z = mouseX * 0.05
      }

      renderer.render(scene, camera)

      if (sceneRef.current) {
        sceneRef.current.animationId = animationId
      }
    }
    animate()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [width, height])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        style={{ width, height, cursor: 'grab' }}
        className="flex items-center justify-center"
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#e5e7eb', borderTopColor: '#2563eb' }} />
            <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>Cargando cerebro...</p>
          </div>
        </div>
      )}

      {/* Region buttons — right next to brain */}
      {isLoaded && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {BRAIN_REGIONS.map((region, i) => (
            <button
              key={i}
              onClick={() => handleRegionSelect(i)}
              className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-all text-left"
              style={{
                background: activeRegion === i ? region.color : '#ffffff',
                color: activeRegion === i ? '#ffffff' : '#6b7280',
                border: `1px solid ${activeRegion === i ? region.color : 'rgba(0,0,0,0.08)'}`,
                boxShadow: activeRegion === i ? `0 2px 12px ${region.color}30` : '0 1px 3px rgba(0,0,0,0.06)',
                minWidth: '140px',
              }}
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: activeRegion === i ? '#ffffff' : region.color }} />
              {region.name}
            </button>
          ))}
        </div>
      )}

      {/* Active region info — bottom */}
      {activeRegion !== null && (
        <div
          className="absolute bottom-4 left-4 right-20 p-4 rounded-lg"
          style={{
            background: '#ffffff',
            border: `1px solid ${BRAIN_REGIONS[activeRegion].color}20`,
            boxShadow: `0 4px 12px ${BRAIN_REGIONS[activeRegion].color}10`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ background: BRAIN_REGIONS[activeRegion].color }} />
            <span className="text-sm font-semibold" style={{ color: '#111827', fontFamily: 'var(--font-display)' }}>
              {BRAIN_REGIONS[activeRegion].name}
            </span>
          </div>
          <p className="text-xs" style={{ color: '#6b7280' }}>
            {BRAIN_REGIONS[activeRegion].desc}
          </p>
        </div>
      )}
    </div>
  )
}
