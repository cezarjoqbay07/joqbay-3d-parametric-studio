/** Contratos públicos do laboratório; independentes de Vue, NestJS e Three.js. */
export type CabinetKind = 'counter' | 'wall' | 'tower'
export type FinishId = 'graphite' | 'oak' | 'linen' | 'white'
export type StructureMode = 'sides-through' | 'horizontal-through'
export type FrontMode = 'open' | 'doors' | 'drawers'

export interface CabinetConfig {
  kind: CabinetKind
  name: string
  width: number // mm
  height: number // mm
  depth: number // mm
  thickness: number // mm
  finish: FinishId
  structure: StructureMode
  front: FrontMode
}

export type PanelRole = 'carcass' | 'back' | 'front'
export interface PanelData {
  id: string
  label: string
  /** x = largura; y = altura; z = profundidade, tudo em milímetros. */
  size: readonly [number, number, number]
  position: readonly [number, number, number]
  edge: PanelRole
  /** Na composição de ambiente, cada módulo mantém seu acabamento. */
  color?: string
}

export interface CabinetPreview {
  panels: PanelData[]
  width: number
  height: number
  depth: number
  estimatedAreaM2: number
}

export type PreviewResult = { ok: true; data: CabinetPreview } | { ok: false; errors: string[] }
export type AppView = 'home' | 'studio' | 'environment' | 'templates' | 'about'

export interface KitchenModule {
  id: string
  label: string
  config: CabinetConfig
}
