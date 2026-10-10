import type { CabinetConfig, CabinetKind, FinishId } from '@/contracts/studio'

export const finishes: Record<FinishId, { label: string; hex: string; description: string }> = {
  graphite: { label: 'Grafite', hex: '#4b5662', description: 'MDF cinza profundo' },
  oak: { label: 'Carvalho', hex: '#be9567', description: 'Madeirado natural' },
  linen: { label: 'Linho', hex: '#d5cbbb', description: 'Tom neutro suave' },
}

export const presets: ReadonlyArray<{
  kind: CabinetKind
  label: string
  eyebrow: string
  description: string
  config: CabinetConfig
}> = [
  {
    kind: 'base',
    label: 'Balcão base',
    eyebrow: '01 / BASE',
    description: 'Corpo para bancada, com cinco painéis conceituais.',
    config: {
      kind: 'base',
      name: 'Balcão gourmet',
      width: 900,
      height: 760,
      depth: 560,
      thickness: 18,
      finish: 'oak',
    },
  },
  {
    kind: 'wall',
    label: 'Armário aéreo',
    eyebrow: '02 / AÉREO',
    description: 'Módulo compacto para composição suspensa.',
    config: {
      kind: 'wall',
      name: 'Aéreo cozinha',
      width: 800,
      height: 650,
      depth: 350,
      thickness: 18,
      finish: 'linen',
    },
  },
  {
    kind: 'tower',
    label: 'Torre vertical',
    eyebrow: '03 / TORRE',
    description: 'Volume alto para estudos de proporção.',
    config: {
      kind: 'tower',
      name: 'Torre multiuso',
      width: 650,
      height: 2100,
      depth: 580,
      thickness: 18,
      finish: 'graphite',
    },
  },
]

export function getPreset(kind: CabinetKind): CabinetConfig {
  const preset = presets.find((entry) => entry.kind === kind) ?? presets[0]!
  return { ...preset.config }
}
