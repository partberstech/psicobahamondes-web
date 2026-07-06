'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface Region3D {
  id: string
  color: string
  position: [number, number, number]
  size: number
  lobe: string
}

// Mapeo de regiones del catálogo a coordenadas 3D en el espacio del modelo cerebral
const REGION_MESHES: Region3D[] = [
  { id: 'prefrontal', color: '#2563eb', position: [0, 0.6, 1.8], size: 0.6, lobe: 'Frontal' },
  { id: 'motora', color: '#6BA3A0', position: [0, 0.5, 1.2], size: 0.5, lobe: 'Frontal' },
  { id: 'sensorial', color: '#A0B4C8', position: [0.1, 1.0, 0.6], size: 0.5, lobe: 'Parietal' },
  { id: 'parietal_sup', color: '#8B6F9E', position: [-0.1, 0.8, -0.2], size: 0.5, lobe: 'Parietal' },
  { id: 'temporal_sup', color: '#C49A6C', position: [1.3, 0.0, 0.4], size: 0.5, lobe: 'Temporal' },
  { id: 'occipital', color: '#A06060', position: [0, 0.2, -1.8], size: 0.5, lobe: 'Occipital' },
  { id: 'cingulate_ant', color: '#7c3aed', position: [0, 0.7, -0.1], size: 0.45, lobe: 'Límbico' },
  { id: 'hipocampo', color: '#059669', position: [1.0, -0.3, -0.4], size: 0.4, lobe: 'Límbico' },
  { id: 'amigdala', color: '#dc2626', position: [0.7, -0.5, 0.7], size: 0.35, lobe: 'Límbico' },
  { id: 'insula', color: '#9B8EC4', position: [1.2, 0.2, 0.6], size: 0.35, lobe: 'Límbico' },
  { id: 'cerebelo', color: '#4a90a4', position: [0.1, -1.2, -1.0], size: 0.6, lobe: 'Subcortical' },
  { id: 'talamo', color: '#5a7a8a', position: [0, 0.0, 0.2], size: 0.4, lobe: 'Subcortical' },
  { id: 'basal_ganglia', color: '#8a6a4a', position: [0.9, -0.2, 0.3], size: 0.45, lobe: 'Subcortical' },
]

interface Brain3DProps {
  width?: number
  height?: number
  activeRegionId?: string | null
  onRegionClick?: (regionId: string) => void
}

export default function Brain3D({ width = 600, height = 400, activeRegionId, onRegionClick }: Brain3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeMarkerId = useRef<string | null>(null)
  const hoveredId = useRef<string | null>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    controls: OrbitControls
    markers: THREE.Mesh[]
    brain: THREE.Group
    frameId: number
    raycaster: THREE.Raycaster
    pointer: THREE.Vector2
    clock: THREE.Clock
  } | null>(null)

  const handleClick = useCallback((id: string | null) => {
    // Toggle: clicking the same (non-empty) region deselects it
    const effective = id && id === activeMarkerId.current ? null : id
    activeMarkerId.current = effective
    onRegionClick?.(effective || '')
  }, [onRegionClick])

  // Sync with parent-controlled active region (catalog clicks)
  useEffect(() => {
    activeMarkerId.current = activeRegionId ?? null
  }, [activeRegionId])

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const W = container.clientWidth || width
    const H = container.clientHeight || height

    // ── Scene ──
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(30, W / H, 1, 2000)
    camera.position.set(0, 1, 7)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Controls ──
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.2
    controls.minDistance = 3.5
    controls.maxDistance = 12
    controls.target.set(0, 0, 0)

    // ── Lights ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(2, 3, 4)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0x8888ff, 0.4)
    fill.position.set(-2, 0, -2)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xffffff, 0.3)
    rim.position.set(0, -2, 2)
    scene.add(rim)

    const hemi = new THREE.HemisphereLight(0x4488ff, 0x002244, 0.4)
    scene.add(hemi)

    // ── Raycaster ──
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const clock = new THREE.Clock()
    const markers: THREE.Mesh[] = []

    // ── Load brain ──
    const loader = new OBJLoader()
    const brain = new THREE.Group()
    scene.add(brain)

    loader.load(
      '/models/BrainMesh.obj',
      (obj) => {
        obj.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshPhysicalMaterial({
              color: 0x1e293b,
              transparent: true,
              opacity: 0.08,
              wireframe: false,
              metalness: 0.1,
              roughness: 0.6,
              side: THREE.DoubleSide,
              depthWrite: false,
            })
          }
        })
        obj.scale.set(1.1, 1.1, 1.1)
        obj.position.y = 0
        brain.add(obj)
      },
      undefined,
      () => console.error('Brain model failed to load')
    )

    // ── Create region markers ──
    REGION_MESHES.forEach((reg) => {
      const geo = new THREE.SphereGeometry(reg.size, 24, 24)
      const mat = new THREE.MeshPhysicalMaterial({
        color: reg.color,
        emissive: reg.color,
        emissiveIntensity: 0.08,
        metalness: 0.1,
        roughness: 0.3,
        clearcoat: 0.3,
        transparent: true,
        opacity: 0.85,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(reg.position[0], reg.position[1], reg.position[2])
      mesh.userData = { type: 'region', regionId: reg.id, baseScale: 1, lobe: reg.lobe }
      scene.add(mesh)
      markers.push(mesh)
    })

    // ── Coordinates ghost grid (subtle) ──
    const gridHelper = new THREE.GridHelper(5, 20, 0x1e293b, 0x1e293b)
    gridHelper.position.y = -1.8
    gridHelper.material.transparent = true
    gridHelper.material.opacity = 0.08
    scene.add(gridHelper)

    // ── Store refs ──
    sceneRef.current = {
      scene, camera, renderer, controls, markers, brain,
      frameId: 0, raycaster, pointer, clock,
    }

    // ── Events ──
    const onPointerDown = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(markers)
      if (hits.length > 0) {
        const id = hits[0].object.userData.regionId as string
        handleClick(id)
      } else {
        // Click empty space → deselect
        handleClick('')
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(markers)
      const hitId = hits.length > 0 ? hits[0].object.userData.regionId as string : null
      hoveredId.current = hitId
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab'
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    renderer.domElement.addEventListener('pointermove', onPointerMove)

    // ── Animate ──
    const animate = () => {
      const frameId = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Animate markers
      markers.forEach((m) => {
        const id = m.userData.regionId as string
        const isActive = id === activeMarkerId.current
        const isHover = id === hoveredId.current
        const scale = isActive ? 1.5 : isHover ? 1.25 : 1
        const targetOpacity = isActive ? 1 : isHover ? 0.95 : 0.85
        const emissiveIntensity = isActive ? 0.5 : isHover ? 0.3 : 0.08

        // Smooth lerp
        const mat = m.material as THREE.MeshPhysicalMaterial
        mat.opacity += (targetOpacity - mat.opacity) * 0.08
        mat.emissiveIntensity += (emissiveIntensity - mat.emissiveIntensity) * 0.08
        mat.needsUpdate = true

        const s = m.scale.x
        m.scale.setScalar(s + (scale - s) * 0.1)
      })

      controls.update()
      renderer.render(scene, camera)
      sceneRef.current!.frameId = frameId
    }
    animate()

    // ── Resize ──
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth || width
      const h = container.clientHeight || height
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(container)

    return () => {
      cancelAnimationFrame(sceneRef.current?.frameId || 0)
      controls.dispose()
      renderer.dispose()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointermove', onPointerMove)
      ro.disconnect()
      markers.forEach(m => { m.geometry.dispose(); (m.material as THREE.Material).dispose() })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height])

  return (
    <div ref={containerRef} className="relative" style={{ width: '100%', height: '100%', minHeight: height }} />
  )
}

export { REGION_MESHES }
