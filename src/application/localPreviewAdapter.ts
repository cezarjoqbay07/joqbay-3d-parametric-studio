import type { CabinetConfig, CabinetPreview, PanelData, PreviewResult } from '@/contracts/studio'

/**
 * ADAPTADOR LOCAL DE DEMONSTRAÇÃO — NÃO É O DOMÍNIO AUTORITATIVO.
 * Simula a resposta futura do NestJS para permitir portfólio estático gratuito.
 * Nenhuma medida resultante deve ser usada como especificação de fabricação.
 */
export function createLocalCabinetPreview(config: CabinetConfig): PreviewResult {
  const errors: string[] = []
  const dimensions = [
    ['Largura', config.width, 300, 2400],
    ['Altura', config.height, 350, 2600],
    ['Profundidade', config.depth, 250, 900],
    ['Espessura', config.thickness, 12, 36],
  ] as const

  for (const [label, value, minimum, maximum] of dimensions) {
    if (!Number.isFinite(value) || value < minimum || value > maximum) {
      errors.push(`${label} deve estar entre ${minimum} e ${maximum} mm.`)
    }
  }
  if (!config.name.trim()) errors.push('Informe um nome para o módulo.')
  if (
    Number.isFinite(config.width) &&
    Number.isFinite(config.thickness) &&
    config.width <= config.thickness * 2
  ) {
    errors.push('A largura deve superar duas espessuras de chapa.')
  }
  if (
    Number.isFinite(config.height) &&
    Number.isFinite(config.thickness) &&
    config.height <= config.thickness * 2
  ) {
    errors.push('A altura deve superar duas espessuras de chapa.')
  }
  if (
    Number.isFinite(config.depth) &&
    Number.isFinite(config.thickness) &&
    config.depth <= config.thickness
  ) {
    errors.push('A profundidade deve superar a espessura da chapa.')
  }
  if (errors.length) return { ok: false, errors }

  const { width: w, height: h, depth: d, thickness: t } = config
  const innerWidth = w - t * 2
  const innerHeight = h - t * 2
  const bodyDepth = d - t
  const panels: PanelData[] = [
    {
      id: 'left',
      label: 'Lateral esquerda',
      size: [t, h, d],
      position: [-w / 2 + t / 2, h / 2, 0],
      edge: 'carcass',
    },
    {
      id: 'right',
      label: 'Lateral direita',
      size: [t, h, d],
      position: [w / 2 - t / 2, h / 2, 0],
      edge: 'carcass',
    },
    {
      id: 'bottom',
      label: 'Base',
      size: [innerWidth, t, bodyDepth],
      position: [0, t / 2, t / 2],
      edge: 'carcass',
    },
    {
      id: 'top',
      label: 'Tampo',
      size: [innerWidth, t, bodyDepth],
      position: [0, h - t / 2, t / 2],
      edge: 'carcass',
    },
    {
      id: 'back',
      label: 'Fundo',
      size: [innerWidth, innerHeight, t],
      position: [0, h / 2, -d / 2 + t / 2],
      edge: 'back',
    },
  ]

  const data: CabinetPreview = {
    panels,
    width: w,
    height: h,
    depth: d,
    // Soma de uma face de cada painel; somente métrica exploratória.
    estimatedAreaM2:
      panels.reduce((sum, panel) => {
        const [x, y, z] = panel.size
        return sum + Math.max(x * y, x * z, y * z)
      }, 0) / 1_000_000,
  }
  return { ok: true, data }
}
