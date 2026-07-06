'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

interface Brain3DProps {
  width?: number
  height?: number
  activeRegionId?: string | null
  onRegionClick?: (regionId: string) => void
  spanishNames?: Record<string, string>
}

const LOBE_COLORS: Record<string, number> = {
  Frontal: 0x4A90D9, Parietal: 0x8B5CF6, Temporal: 0xEC4899,
  Occipital: 0x10B981, Limbic: 0xF59E0B, Insular: 0xEF4444,
  Subcortical: 0x6B8FA3, Cerebellum: 0x06B6D4, Brainstem: 0x8B9EAD,
  Ventricular: 0x6BB5A4,
}

interface DKRegion { id: string; name: string; lobe: string; spanishId: string; files: string[]; isSubcortical?: boolean }

const DK_REGIONS: DKRegion[] = [
  // Frontal → prefrontal
  { id: 'superiorfrontal',       name: 'Superior Frontal Gyrus',          lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.superiorfrontal.obj', 'rh.pial.DK.superiorfrontal.obj'] },
  { id: 'rostralmiddlefrontal',  name: 'Rostral Middle Frontal Gyrus',    lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.rostralmiddlefrontal.obj', 'rh.pial.DK.rostralmiddlefrontal.obj'] },
  { id: 'caudalmiddlefrontal',   name: 'Caudal Middle Frontal Gyrus',     lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.caudalmiddlefrontal.obj', 'rh.pial.DK.caudalmiddlefrontal.obj'] },
  { id: 'parsopercularis',       name: 'Pars Opercularis (Broca)',         lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.parsopercularis.obj', 'rh.pial.DK.parsopercularis.obj'] },
  { id: 'parstriangularis',      name: 'Pars Triangularis',               lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.parstriangularis.obj', 'rh.pial.DK.parstriangularis.obj'] },
  { id: 'parsorbitalis',         name: 'Pars Orbitalis',                  lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.parsorbitalis.obj', 'rh.pial.DK.parsorbitalis.obj'] },
  { id: 'lateralorbitofrontal',  name: 'Lateral Orbitofrontal',           lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.lateralorbitofrontal.obj', 'rh.pial.DK.lateralorbitofrontal.obj'] },
  { id: 'medialorbitofrontal',   name: 'Medial Orbitofrontal',            lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.medialorbitofrontal.obj', 'rh.pial.DK.medialorbitofrontal.obj'] },
  { id: 'frontalpole',           name: 'Frontal Pole',                    lobe: 'Frontal',   spanishId: 'prefrontal',     files: ['lh.pial.DK.frontalpole.obj', 'rh.pial.DK.frontalpole.obj'] },
  // Frontal → motora
  { id: 'precentral',            name: 'Precentral Gyrus (Motor)',        lobe: 'Frontal',   spanishId: 'motora',         files: ['lh.pial.DK.precentral.obj', 'rh.pial.DK.precentral.obj'] },
  { id: 'paracentral',           name: 'Paracentral Lobule',              lobe: 'Frontal',   spanishId: 'motora',         files: ['lh.pial.DK.paracentral.obj', 'rh.pial.DK.paracentral.obj'] },
  // Parietal
  { id: 'postcentral',           name: 'Postcentral Gyrus (Somatosensory)', lobe: 'Parietal', spanishId: 'sensorial',       files: ['lh.pial.DK.postcentral.obj', 'rh.pial.DK.postcentral.obj'] },
  { id: 'superiorparietal',      name: 'Superior Parietal',               lobe: 'Parietal',  spanishId: 'parietal_sup',    files: ['lh.pial.DK.superiorparietal.obj', 'rh.pial.DK.superiorparietal.obj'] },
  { id: 'inferiorparietal',      name: 'Inferior Parietal',               lobe: 'Parietal',  spanishId: 'parietal_sup',    files: ['lh.pial.DK.inferiorparietal.obj', 'rh.pial.DK.inferiorparietal.obj'] },
  { id: 'supramarginal',         name: 'Supramarginal Gyrus',             lobe: 'Parietal',  spanishId: 'parietal_sup',    files: ['lh.pial.DK.supramarginal.obj', 'rh.pial.DK.supramarginal.obj'] },
  { id: 'precuneus',             name: 'Precuneus',                        lobe: 'Parietal',  spanishId: 'parietal_sup',    files: ['lh.pial.DK.precuneus.obj', 'rh.pial.DK.precuneus.obj'] },
  // Temporal
  { id: 'superiortemporal',      name: 'Superior Temporal',               lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.superiortemporal.obj', 'rh.pial.DK.superiortemporal.obj'] },
  { id: 'middletemporal',        name: 'Middle Temporal',                 lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.middletemporal.obj', 'rh.pial.DK.middletemporal.obj'] },
  { id: 'inferiortemporal',      name: 'Inferior Temporal',               lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.inferiortemporal.obj', 'rh.pial.DK.inferiortemporal.obj'] },
  { id: 'bankssts',              name: 'Banks of STS',                    lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.bankssts.obj', 'rh.pial.DK.bankssts.obj'] },
  { id: 'fusiform',              name: 'Fusiform Gyrus',                  lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.fusiform.obj', 'rh.pial.DK.fusiform.obj'] },
  { id: 'transversetemporal',    name: 'Heschl Gyrus',                    lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.transversetemporal.obj', 'rh.pial.DK.transversetemporal.obj'] },
  { id: 'entorhinal',            name: 'Entorhinal Cortex',               lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.entorhinal.obj', 'rh.pial.DK.entorhinal.obj'] },
  { id: 'temporalpole',          name: 'Temporal Pole',                   lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.temporalpole.obj', 'rh.pial.DK.temporalpole.obj'] },
  { id: 'parahippocampal',       name: 'Parahippocampal Gyrus',           lobe: 'Temporal',  spanishId: 'temporal_sup',    files: ['lh.pial.DK.parahippocampal.obj', 'rh.pial.DK.parahippocampal.obj'] },
  // Occipital
  { id: 'lateraloccipital',      name: 'Lateral Occipital',               lobe: 'Occipital', spanishId: 'occipital',       files: ['lh.pial.DK.lateraloccipital.obj', 'rh.pial.DK.lateraloccipital.obj'] },
  { id: 'lingual',               name: 'Lingual Gyrus',                   lobe: 'Occipital', spanishId: 'occipital',       files: ['lh.pial.DK.lingual.obj', 'rh.pial.DK.lingual.obj'] },
  { id: 'cuneus',                name: 'Cuneus',                          lobe: 'Occipital', spanishId: 'occipital',       files: ['lh.pial.DK.cuneus.obj', 'rh.pial.DK.cuneus.obj'] },
  { id: 'pericalcarine',         name: 'Primary Visual Cortex',           lobe: 'Occipital', spanishId: 'occipital',       files: ['lh.pial.DK.pericalcarine.obj', 'rh.pial.DK.pericalcarine.obj'] },
  // Cingulate (Limbic)
  { id: 'rostralanteriorcingulate', name: 'Rostral Anterior Cingulate',   lobe: 'Limbic',    spanishId: 'cingulate_ant',   files: ['lh.pial.DK.rostralanteriorcingulate.obj', 'rh.pial.DK.rostralanteriorcingulate.obj'] },
  { id: 'caudalanteriorcingulate',  name: 'Caudal Anterior Cingulate',    lobe: 'Limbic',    spanishId: 'cingulate_ant',   files: ['lh.pial.DK.caudalanteriorcingulate.obj', 'rh.pial.DK.caudalanteriorcingulate.obj'] },
  { id: 'posteriorcingulate',       name: 'Posterior Cingulate',          lobe: 'Limbic',    spanishId: 'cingulate_ant',   files: ['lh.pial.DK.posteriorcingulate.obj', 'rh.pial.DK.posteriorcingulate.obj'] },
  { id: 'isthmuscingulate',         name: 'Isthmus Cingulate',            lobe: 'Limbic',    spanishId: 'cingulate_ant',   files: ['lh.pial.DK.isthmuscingulate.obj', 'rh.pial.DK.isthmuscingulate.obj'] },
  // Insula
  { id: 'insula',                name: 'Insular Cortex',                  lobe: 'Insular',   spanishId: 'insula',          files: ['lh.pial.DK.insula.obj', 'rh.pial.DK.insula.obj'] },
  // Subcortical
  { id: 'hippocampus',           name: 'Hippocampus',                     lobe: 'Subcortical', spanishId: 'hipocampo',     files: ['Left-Hippocampus.obj', 'Right-Hippocampus.obj'], isSubcortical: true },
  { id: 'amygdala',              name: 'Amygdala',                        lobe: 'Subcortical', spanishId: 'amigdala',      files: ['Left-Amygdala.obj', 'Right-Amygdala.obj'], isSubcortical: true },
  { id: 'thalamus',              name: 'Thalamus',                        lobe: 'Subcortical', spanishId: 'talamo',        files: ['Left-Thalamus-Proper.obj', 'Right-Thalamus-Proper.obj'], isSubcortical: true },
  { id: 'caudate',               name: 'Caudate Nucleus',                 lobe: 'Subcortical', spanishId: 'basal_ganglia', files: ['Left-Caudate.obj', 'Right-Caudate.obj'], isSubcortical: true },
  { id: 'putamen',               name: 'Putamen',                         lobe: 'Subcortical', spanishId: 'basal_ganglia', files: ['Left-Putamen.obj', 'Right-Putamen.obj'], isSubcortical: true },
  { id: 'pallidum',              name: 'Globus Pallidus',                 lobe: 'Subcortical', spanishId: 'basal_ganglia', files: ['Left-Pallidum.obj', 'Right-Pallidum.obj'], isSubcortical: true },
  { id: 'accumbens',             name: 'Nucleus Accumbens',               lobe: 'Subcortical', spanishId: 'basal_ganglia', files: ['Left-Accumbens-area.obj', 'Right-Accumbens-area.obj'], isSubcortical: true },
  { id: 'cerebellum',            name: 'Cerebellum',                      lobe: 'Cerebellum',  spanishId: 'cerebelo',       files: ['Left-Cerebellum-Cortex.obj', 'Right-Cerebellum-Cortex.obj'], isSubcortical: true },
  { id: 'brainstem',             name: 'Brainstem',                       lobe: 'Brainstem',   spanishId: 'tronco',         files: ['Brain-Stem.obj'], isSubcortical: true },
]

export default function Brain3D({ width = 500, height = 400, activeRegionId, onRegionClick, spanishNames = {} }: Brain3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const regionGroupsRef = useRef<Map<string, { group: THREE.Group; material: THREE.MeshStandardMaterial }>>(new Map())
  const animRef = useRef<number>(0)
  const hoveredRef = useRef<string | null>(null)
  const loadingRef = useRef(true)
  const activeRef = useRef(activeRegionId)
  const [loaded, setLoaded] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hoveredName, setHoveredName] = useState<string | null>(null)

  activeRef.current = activeRegionId

  const handleClick = useCallback(() => {
    const camera = cameraRef.current
    const scene = sceneRef.current
    if (!camera || !scene) return

    const intersects = raycasterRef.current.intersectObjects(scene.children, true)
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object
      while (obj) {
        if (obj.userData?.groupSpanishId) {
          onRegionClick?.(obj.userData.groupSpanishId)
          return
        }
        obj = obj.parent
      }
    }
  }, [onRegionClick])

  function getSpanishIdFromIntersect(intersects: THREE.Intersection[]): string | null {
    for (const hit of intersects) {
      let obj: THREE.Object3D | null = hit.object
      while (obj) {
        if (obj.userData?.groupSpanishId) return obj.userData.groupSpanishId
        obj = obj.parent
      }
    }
    return null
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf8fafc)
    sceneRef.current = scene

    // Camera
    const aspect = container.clientWidth / container.clientHeight
    const camera = new THREE.PerspectiveCamera(35, aspect, 0.1, 1000)
    camera.position.set(0, 0, 180)
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.NoToneMapping
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls — wider zoom range
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 60
    controls.maxDistance = 400
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.8
    controls.target.set(0, 0, 0)
    controlsRef.current = controls

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 1.5)
    dir.position.set(50, 80, 60)
    scene.add(dir)
    const back = new THREE.DirectionalLight(0xaaccff, 0.4)
    back.position.set(-30, -20, -40)
    scene.add(back)

    // Click handler
    const onClickHandler = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      handleClick()
    }
    renderer.domElement.addEventListener('click', onClickHandler)

    // Mousemove handler
    const onMoveHandler = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycasterRef.current.setFromCamera(mouseRef.current, camera)

      const intersects = raycasterRef.current.intersectObjects(scene.children, true)
      const hitId = getSpanishIdFromIntersect(intersects)
      if (hitId !== hoveredRef.current) {
        hoveredRef.current = hitId
        const name = hitId ? (spanishNames[hitId] || null) : null
        setHoveredName(name)
        renderer.domElement.style.cursor = hitId ? 'pointer' : 'default'
      }
    }
    renderer.domElement.addEventListener('mousemove', onMoveHandler)

    // Load meshes grouped by spanishId
    const loader = new OBJLoader()
    loadingRef.current = true

    function createMat(lobe: string): THREE.MeshStandardMaterial {
      return new THREE.MeshStandardMaterial({
        color: LOBE_COLORS[lobe] || 0x6B8FA3,
        roughness: 0.45,
        metalness: 0.05,
      })
    }

    // Pre-create groups for each unique spanishId
    const groups = new Map<string, THREE.Group>()
    for (const r of DK_REGIONS) {
      if (!groups.has(r.spanishId)) {
        const g = new THREE.Group()
        g.userData.groupSpanishId = r.spanishId
        scene.add(g)
        groups.set(r.spanishId, g)
      }
    }

    const totalFiles = DK_REGIONS.reduce((s, r) => s + r.files.length, 0)
    let loadedFiles = 0

    DK_REGIONS.forEach((region) => {
      const mat = createMat(region.lobe)
      const group = groups.get(region.spanishId)!

      region.files.forEach((fileName) => {
        const folder = region.isSubcortical ? 'subcortical' : 'dk'
        const path = `/models/brain3d/${folder}/${fileName}`

        loader.load(
          path,
          (obj) => {
            obj.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const mesh = child as THREE.Mesh
                mesh.material = mat.clone()
                mesh.userData.groupSpanishId = region.spanishId
                group.add(mesh)
              }
            })
            loadedFiles++
            const pct = Math.round((loadedFiles / totalFiles) * 100)
            setProgress(pct)
            if (loadedFiles >= totalFiles) {
              loadingRef.current = false
              setLoaded(true)
              // Build region groups map
              const map = regionGroupsRef.current
              map.clear()
              groups.forEach((g, sid) => {
                const meshes: THREE.Mesh[] = []
                g.children.forEach((c: THREE.Object3D) => {
                  if (c instanceof THREE.Mesh) meshes.push(c)
                })
                // Collect all meshes + create shared material ref for the group
                let sharedMat: THREE.MeshStandardMaterial | null = null
                if (meshes.length > 0) {
                  sharedMat = meshes[0].material as THREE.MeshStandardMaterial
                }
                if (sharedMat) {
                  map.set(sid, { group: g, material: sharedMat })
                }
              })
            }
          },
          undefined,
          () => {
            loadedFiles++
            const pct = Math.round((loadedFiles / totalFiles) * 100)
            setProgress(pct)
            if (loadedFiles >= totalFiles) {
              loadingRef.current = false
              setLoaded(true)
            }
          }
        )
      })
    })

    // Animation loop — iterate by 14 groups, not 46 DK meshes
    function animate() {
      animRef.current = requestAnimationFrame(animate)
      controls.update()

      const activeId = activeRef.current
      const hoveredId = hoveredRef.current

      regionGroupsRef.current.forEach(({ group, material: mat }, sid) => {
        const isActive = sid === activeId
        const isHovered = sid === hoveredId
        if (isActive) {
          mat.emissive.setHex(0x2563eb)
          mat.emissiveIntensity = 0.4 + 0.25 * Math.sin(Date.now() * 0.003)
        } else if (isHovered) {
          mat.emissive.setHex(0x60a5fa)
          mat.emissiveIntensity = 0.25
        } else {
          mat.emissive.setHex(0x000000)
          mat.emissiveIntensity = 0
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Resize
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(animRef.current)
      ro.disconnect()
      renderer.domElement.removeEventListener('click', onClickHandler)
      renderer.domElement.removeEventListener('mousemove', onMoveHandler)
      renderer.dispose()
      controls.dispose()
      while (scene.children.length > 0) {
        const child = scene.children[0]
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (child.material instanceof THREE.Material) child.material.dispose()
        }
        if (child instanceof THREE.Group) {
          child.children.forEach((c) => {
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose()
              if (c.material instanceof THREE.Material) c.material.dispose()
            }
          })
        }
        scene.remove(child)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]) // only re-init on size change

  return (
    <div className="relative" style={{ width, height }}>
      <div ref={containerRef} className="w-full h-full rounded-xl overflow-hidden shadow-sm border border-slate-100" />

      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-700 text-sm font-medium">Cargando cerebro...</p>
            <p className="text-slate-400 text-xs mt-1">{progress}%</p>
          </div>
        </div>
      )}

      {hoveredName && loaded && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm text-slate-800 text-xs font-medium px-3 py-1.5 rounded-full border border-slate-200 shadow-sm pointer-events-none z-10 whitespace-nowrap">
          {hoveredName}
        </div>
      )}

      {loaded && !hoveredName && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-slate-400 text-[10px] pointer-events-none z-10">
          Arrastra para rotar · Scroll para zoom · Click en una región
        </div>
      )}
    </div>
  )
}
