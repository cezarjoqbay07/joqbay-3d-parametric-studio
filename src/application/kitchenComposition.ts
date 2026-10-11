import { createLocalCabinetPreview } from './localPreviewAdapter'
import { finishes, getPreset } from './studioPresets'
import type { CabinetPreview, KitchenModule, PreviewResult } from '@/contracts/studio'

/** Um ambiente LINEAR ilustrativo, com módulos independentes e editáveis. */
export function createKitchenModules(): KitchenModule[] {
  return [
    {
      id: 'counter',
      label: 'Balcão',
      config: { ...getPreset('counter'), name: 'Balcão principal', width: 900, finish: 'oak' },
    },
    {
      id: 'drawers',
      label: 'Gaveteiro',
      config: {
        ...getPreset('counter'),
        name: 'Gaveteiro',
        width: 600,
        front: 'drawers',
        finish: 'linen',
      },
    },
    {
      id: 'fridge-tower',
      label: 'Torre fria (conceitual)',
      config: {
        ...getPreset('tower'),
        name: 'Torre fria',
        width: 700,
        height: 2150,
        finish: 'graphite',
      },
    },
    {
      id: 'wall',
      label: 'Aéreo',
      config: { ...getPreset('wall'), name: 'Aéreo superior', width: 800, finish: 'white' },
    },
  ]
}

const GAP_MM = 16
const WALL_BOTTOM_MM = 1500

/** Usa o mesmo contrato de cena do configurador individual. Sem código Three.js. */
export function createKitchenPreview(modules: KitchenModule[]): PreviewResult {
  const ground = modules.filter((module) => module.id !== 'wall')
  const totalWidth =
    ground.reduce((sum, module) => sum + module.config.width, 0) +
    GAP_MM * Math.max(ground.length - 1, 0)
  if (!ground.length || !modules.length)
    return { ok: false, errors: ['A composição precisa de módulos.'] }
  const counterCenter = -totalWidth / 2 + ground[0]!.config.width / 2
  let cursor = -totalWidth / 2
  const panels: CabinetPreview['panels'] = []
  let maxHeight = 0
  let maxDepth = 0
  let estimatedAreaM2 = 0
  for (const module of modules) {
    const result = createLocalCabinetPreview(module.config)
    if (!result.ok)
      return { ok: false, errors: result.errors.map((error) => `${module.label}: ${error}`) }
    const { data } = result
    const isWall = module.id === 'wall'
    const centerX = isWall ? counterCenter : cursor + module.config.width / 2
    const elevation = isWall ? WALL_BOTTOM_MM : 0
    if (!isWall) cursor += module.config.width + GAP_MM
    maxHeight = Math.max(maxHeight, elevation + data.height)
    maxDepth = Math.max(maxDepth, data.depth)
    estimatedAreaM2 += data.estimatedAreaM2
    for (const panel of data.panels) {
      panels.push({
        ...panel,
        id: `${module.id}/${panel.id}`,
        label: `${module.label} · ${panel.label}`,
        position: [panel.position[0] + centerX, panel.position[1] + elevation, panel.position[2]],
        color: finishes[module.config.finish].hex,
      })
    }
  }
  return {
    ok: true,
    data: { panels, width: totalWidth, height: maxHeight, depth: maxDepth, estimatedAreaM2 },
  }
}
