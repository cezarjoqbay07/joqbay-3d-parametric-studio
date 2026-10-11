import type { CabinetConfig, CabinetPreview, PanelData, PreviewResult } from '@/contracts/studio'

/**
 * Adaptador geométrico LOCAL de portfólio. Não é domínio industrial autoritativo.
 * Usa medidas nominais: sem rasgos, fitas, ferragens ou descontos de fabricação.
 * Contrato substituível posteriormente por uma API NestJS.
 */
export const DEMO_BACK_THICKNESS_MM = 6
export const DEMO_FRONT_GAP_MM = 2

export function createLocalCabinetPreview(config: CabinetConfig): PreviewResult {
  const errors: string[] = []
  const dimensions = [
    ['Largura', config.width, 300, 2400],
    ['Altura', config.height, 350, 2600],
    ['Profundidade', config.depth, 250, 900],
    ['Espessura', config.thickness, 12, 36],
  ] as const
  for (const [label, value, minimum, maximum] of dimensions) {
    if (!Number.isFinite(value) || value < minimum || value > maximum)
      errors.push(`${label} deve estar entre ${minimum} e ${maximum} mm.`)
  }
  if (!config.name.trim()) errors.push('Informe um nome para o módulo.')
  if (!['sides-through', 'horizontal-through'].includes(config.structure))
    errors.push('Selecione um tipo de estrutura válido.')
  if (!['open', 'doors', 'drawers'].includes(config.front))
    errors.push('Selecione uma frente válida.')
  if (
    Number.isFinite(config.width) &&
    Number.isFinite(config.thickness) &&
    config.width <= config.thickness * 2
  )
    errors.push('A largura deve superar duas espessuras de chapa.')
  if (
    Number.isFinite(config.height) &&
    Number.isFinite(config.thickness) &&
    config.height <= config.thickness * 2
  )
    errors.push('A altura deve superar duas espessuras de chapa.')
  if (Number.isFinite(config.depth) && config.depth <= DEMO_BACK_THICKNESS_MM)
    errors.push('A profundidade deve superar a espessura do fundo.')
  if (errors.length) return { ok: false, errors }

  const { width: w, height: h, depth: d, thickness: t } = config
  const sidesThrough = config.structure === 'sides-through'
  const sideHeight = sidesThrough ? h : h - 2 * t
  const horizontalWidth = sidesThrough ? w - 2 * t : w
  const innerWidth = w - 2 * t
  const innerHeight = h - 2 * t
  const panels: PanelData[] = [
    {
      id: 'left',
      label: 'Lateral esquerda',
      size: [t, sideHeight, d],
      position: [-w / 2 + t / 2, h / 2, 0],
      edge: 'carcass',
    },
    {
      id: 'right',
      label: 'Lateral direita',
      size: [t, sideHeight, d],
      position: [w / 2 - t / 2, h / 2, 0],
      edge: 'carcass',
    },
    {
      id: 'bottom',
      label: 'Base',
      size: [horizontalWidth, t, d],
      position: [0, t / 2, 0],
      edge: 'carcass',
    },
    {
      id: 'top',
      label: 'Tampo',
      size: [horizontalWidth, t, d],
      position: [0, h - t / 2, 0],
      edge: 'carcass',
    },
    // Fundo de 6 mm embutido no volume nominal, junto ao plano traseiro.
    {
      id: 'back',
      label: 'Fundo 6 mm',
      size: [innerWidth, innerHeight, DEMO_BACK_THICKNESS_MM],
      position: [0, h / 2, -d / 2 + DEMO_BACK_THICKNESS_MM / 2],
      edge: 'back',
    },
  ]

  if (config.front === 'doors') {
    const gap = DEMO_FRONT_GAP_MM
    const doorWidth = (w - gap * 3) / 2
    for (let index = 0; index < 2; index++) {
      panels.push({
        id: `door-${index + 1}`,
        label: `Porta ${index + 1}`,
        size: [doorWidth, h - 2 * gap, t],
        position: [((index === 0 ? -1 : 1) * (doorWidth + gap)) / 2, h / 2, d / 2 + t / 2],
        edge: 'front',
      })
    }
  } else if (config.front === 'drawers') {
    const gap = DEMO_FRONT_GAP_MM
    const frontHeight = (h - 4 * gap) / 3
    for (let index = 0; index < 3; index++) {
      panels.push({
        id: `drawer-front-${index + 1}`,
        label: `Frente de gaveta ${index + 1}`,
        size: [w - 2 * gap, frontHeight, t],
        position: [0, gap * (index + 1) + frontHeight * (index + 0.5), d / 2 + t / 2],
        edge: 'front',
      })
    }
  }

  const area =
    panels.reduce((sum, panel) => {
      const [x, y, z] = panel.size
      return sum + Math.max(x * y, x * z, y * z)
    }, 0) / 1_000_000

  return {
    ok: true,
    data: {
      panels,
      width: w,
      height: h,
      depth: d + (config.front === 'open' ? 0 : t),
      estimatedAreaM2: area,
    } satisfies CabinetPreview,
  }
}
