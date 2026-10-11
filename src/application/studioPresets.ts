import type { CabinetConfig, CabinetKind, FinishId } from '@/contracts/studio'

export const finishes: Record<FinishId, { label: string; hex: string; description: string }> = {
  graphite: { label: 'Grafite', hex: '#50555c', description: 'Cinza profundo acetinado' },
  oak: { label: 'Carvalho', hex: '#b58c61', description: 'Madeirado natural' },
  linen: { label: 'Linho', hex: '#d5cbbb', description: 'Neutro quente' },
  white: { label: 'Branco TX', hex: '#e8e6e0', description: 'Branco texturizado' },
}

export const presets: ReadonlyArray<{
  kind: CabinetKind
  label: string
  eyebrow: string
  description: string
  config: CabinetConfig
}> = [
  {
    kind: 'counter',
    label: 'Balcão',
    eyebrow: '01 / BALCÃO',
    description: 'Balcão com fundo de 6 mm, estrutura configurável e portas opcionais.',
    config: {
      kind: 'counter',
      name: 'Balcão gourmet',
      width: 900,
      height: 760,
      depth: 560,
      thickness: 18,
      finish: 'oak',
      structure: 'sides-through',
      front: 'doors',
    },
  },
  {
    kind: 'wall',
    label: 'Aéreo',
    eyebrow: '02 / AÉREO',
    description: 'Armário suspenso com proporções compactas e acabamento ajustável.',
    config: {
      kind: 'wall',
      name: 'Aéreo cozinha',
      width: 800,
      height: 650,
      depth: 350,
      thickness: 18,
      finish: 'linen',
      structure: 'sides-through',
      front: 'doors',
    },
  },
  {
    kind: 'tower',
    label: 'Torre',
    eyebrow: '03 / TORRE',
    description: 'Módulo alto para composições verticais e estudos de ambiente.',
    config: {
      kind: 'tower',
      name: 'Torre multiuso',
      width: 650,
      height: 2100,
      depth: 580,
      thickness: 18,
      finish: 'graphite',
      structure: 'horizontal-through',
      front: 'doors',
    },
  },
]

export function getPreset(kind: CabinetKind): CabinetConfig {
  const preset = presets.find((entry) => entry.kind === kind) ?? presets[0]!
  return { ...preset.config }
}
