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
  let explodeTarget = 0
  let explodeProgress = 0
  let pointerStart: { x: number; y: number } | null = null

  function disposePanels() {
    for (const child of [...group.children]) {
      group.remove(child)
      child.traverse((object) => {
        if (object instanceof Mesh || object instanceof LineSegments) {
          object.geometry.dispose()
          const materials = Array.isArray(object.material) ? object.material : [object.material]
          materials.forEach((material) => material.dispose())
        }
      })
    }
    meshes.length = 0
  }

  /** Puxadores são decoração da cena, não ferragens especificadas pelo domínio. */
  function addIndicativeHandle(
    panelId: string,
    mesh: Mesh,
    width: number,
    height: number,
    depth: number,
  ) {
    const door = panelId.includes('door-')
    const drawer = panelId.includes('drawer-front-')
    if (!door && !drawer) return
    const handle = new Mesh(
      new BoxGeometry(
        door ? 0.009 : Math.min(width * 0.52, 0.25),
        door ? Math.min(height * 0.17, 0.15) : 0.009,
        0.014,
      ),
      new MeshStandardMaterial({ color: '#bac5c9', roughness: 0.29, metalness: 0.75 }),
    )
    const isLeft = panelId.endsWith('door-1')
    const isRight = panelId.endsWith('door-2')
    const x = isLeft ? width / 2 - 0.045 : isRight ? -width / 2 + 0.045 : 0
    handle.position.set(x, drawer ? height * 0.28 : 0, depth / 2 + 0.009)
    handle.castShadow = true
    mesh.add(handle)
  }

  function updateSelection(id: string | null) {
    currentSelected = id
    for (const mesh of meshes) {
      const material = mesh.material as MeshStandardMaterial
      material.emissive = new Color(
        mesh.userData.id === id || mesh.userData.moduleId === id ? '#2e8f82' : '#000000',
      )
      material.emissiveIntensity =
        mesh.userData.id === id || mesh.userData.moduleId === id ? 0.42 : 0
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
          color:
            panel.edge === 'back'
              ? new Color(panel.color ?? color).multiplyScalar(0.78)
              : new Color(panel.color ?? color),
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
      addIndicativeHandle(panel.id, mesh, width, height, depth)
      mesh.userData.id = panel.id
      mesh.userData.moduleId = panel.id.includes('/') ? panel.id.split('/')[0] : null
      mesh.userData.restPosition = mesh.position.clone()
      // O deslocamento de apresentação não altera dimensões nem regras de peças.
      const explodedDirection =
        panel.edge === 'front'
          ? new Vector3(0, 0, 0.25)
          : panel.id.endsWith('left')
            ? new Vector3(-0.15, 0, 0)
            : panel.id.endsWith('right')
              ? new Vector3(0.15, 0, 0)
              : panel.id.endsWith('top')
                ? new Vector3(0, 0.14, 0)
                : panel.id.endsWith('bottom')
                  ? new Vector3(0, -0.12, 0)
                  : new Vector3(0, 0, -0.18)
      mesh.userData.explodedDirection = explodedDirection
      group.add(mesh)
      meshes.push(mesh)

      const outline = new LineSegments(
        new EdgesGeometry(mesh.geometry),
        new LineBasicMaterial({ color: 0x12181d, transparent: true, opacity: 0.5 }),
      )
      mesh.add(outline)
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
    explodeProgress += (explodeTarget - explodeProgress) * 0.1
    for (const mesh of meshes) {
      mesh.position
        .copy(mesh.userData.restPosition as Vector3)
        .addScaledVector(mesh.userData.explodedDirection as Vector3, explodeProgress)
    }
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
    setExploded: (value: boolean) => {
      explodeTarget = value ? 1 : 0
    },
    setAutoRotate: (value: boolean) => {
      controls.autoRotate = value
      controls.autoRotateSpeed = 0.75
    },
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
