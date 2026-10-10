import {
  ACESFilmicToneMapping,
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Group,
  GridHelper,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshStandardMaterial,
  type Material,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import type { CabinetPreview } from '@/contracts/studio'

const MM_PER_UNIT = 1000
const toUnits = (mm: number) => mm / MM_PER_UNIT

/** Adaptador de renderização: só transforma dados geométricos em objetos Three.js. */
export function createCabinetRenderer(
  container: HTMLElement,
  onSelect: (id: string | null) => void,
) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(40, 1, 0.01, 150)
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.35
  renderer.shadowMap.enabled = true
  renderer.domElement.className = 'studio-canvas'
  renderer.domElement.setAttribute('aria-label', 'Visualização tridimensional interativa do móvel')
  container.appendChild(renderer.domElement)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.09
  controls.minDistance = 0.65
  controls.maxDistance = 15
  controls.maxPolarAngle = Math.PI / 2 - 0.035

  scene.add(new AmbientLight(0xffffff, 2.0))
  const key = new DirectionalLight(0xffffff, 3.7)
  key.position.set(2, 4, 3)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  scene.add(key)
  const fill = new DirectionalLight(0x80dcd1, 1.0)
  fill.position.set(-3, 2, -2)
  scene.add(fill)

  const floor = new Mesh(
    new PlaneGeometry(30, 30),
    new MeshStandardMaterial({
      color: 0x14191e,
      roughness: 0.96,
      transparent: true,
      opacity: 0.14,
    }),
  )
  floor.rotation.x = -Math.PI / 2
  floor.receiveShadow = true
  floor.position.y = -0.008
  scene.add(floor)
  const grid = new GridHelper(8, 32, 0x617a81, 0x34414a)
  grid.position.y = -0.004
  const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
  gridMaterials.forEach((material: Material) => {
    material.transparent = true
    material.opacity = 0.18
  })
  scene.add(grid)

  const group = new Group()
  scene.add(group)
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  const meshes: Mesh[] = []
  let current: CabinetPreview | null = null
  let currentColor = '#be9567'
  let currentSelected: string | null = null
  let frame = 0
  let disposed = false
  let pointerStart: { x: number; y: number } | null = null

  function disposePanels() {
    for (const child of [...group.children]) {
      group.remove(child)
      if (child instanceof Mesh) {
        child.geometry.dispose()
        const material = child.material
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material.dispose()
      }
      if (child instanceof LineSegments) {
        child.geometry.dispose()
        const material = child.material
        if (Array.isArray(material)) material.forEach((item) => item.dispose())
        else material.dispose()
      }
    }
    meshes.length = 0
  }

  function updateSelection(id: string | null) {
    currentSelected = id
    for (const mesh of meshes) {
      const material = mesh.material as MeshStandardMaterial
      material.emissive = new Color(mesh.userData.id === id ? '#2e8f82' : '#000000')
      material.emissiveIntensity = mesh.userData.id === id ? 0.42 : 0
    }
  }

  function updatePreview(model: CabinetPreview, color: string, selectedId: string | null) {
    current = model
    currentColor = color
    disposePanels()
    for (const panel of model.panels) {
      const width = toUnits(panel.size[0])
      const height = toUnits(panel.size[1])
      const depth = toUnits(panel.size[2])
      const mesh = new Mesh(
        new BoxGeometry(width, height, depth),
        new MeshStandardMaterial({
          color: panel.edge === 'back' ? new Color(color).multiplyScalar(0.79) : new Color(color),
          roughness: 0.69,
          metalness: 0.025,
        }),
      )
      const x = toUnits(panel.position[0])
      const y = toUnits(panel.position[1])
      const z = toUnits(panel.position[2])
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      mesh.userData.id = panel.id
      group.add(mesh)
      meshes.push(mesh)

      const outline = new LineSegments(
        new EdgesGeometry(mesh.geometry),
        new LineBasicMaterial({ color: 0x12181d, transparent: true, opacity: 0.5 }),
      )
      outline.position.copy(mesh.position)
      group.add(outline)
    }
    updateSelection(selectedId)
  }

  function frameModel() {
    if (!current) return
    const maxDimension = Math.max(current.width, current.height, current.depth) / MM_PER_UNIT
    const target = new Vector3(0, toUnits(current.height) / 2, 0)
    const distance = Math.max(1.8, maxDimension * 2.15)
    controls.target.copy(target)
    camera.position.set(distance * 0.91, target.y + distance * 0.66, distance * 1.1)
    controls.update()
  }

  function sizeCanvas() {
    if (disposed) return
    const width = Math.max(1, container.clientWidth)
    const height = Math.max(1, container.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(sizeCanvas)
  resizeObserver.observe(container)
  sizeCanvas()

  function render() {
    if (disposed) return
    controls.update()
    renderer.render(scene, camera)
    frame = requestAnimationFrame(render)
  }
  render()

  function onPointerDown(event: PointerEvent) {
    pointerStart = { x: event.clientX, y: event.clientY }
  }
  function onPointerUp(event: PointerEvent) {
    if (
      !pointerStart ||
      Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 6
    )
      return
    const rect = renderer.domElement.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pointer.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    raycaster.setFromCamera(pointer, camera)
    const [hit] = raycaster.intersectObjects(meshes)
    const id = hit?.object.userData.id as string | undefined
    updateSelection(id ?? null)
    onSelect(id ?? null)
  }
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)

  return {
    updatePreview,
    updateSelection,
    frameModel,
    capturePng: () => {
      renderer.render(scene, camera)
      return renderer.domElement.toDataURL('image/png')
    },
    dispose: () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      renderer.domElement.removeEventListener('pointerup', onPointerUp)
      controls.dispose()
      disposePanels()
      floor.geometry.dispose()
      ;(floor.material as MeshStandardMaterial).dispose()
      grid.geometry.dispose()
      gridMaterials.forEach((material: Material) => material.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
