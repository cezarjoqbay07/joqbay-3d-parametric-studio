/** Contrato compartilhável com uma futura API HTTP. Sem dependência de Vue ou Three.js. */
export type CabinetKind = 'base' | 'wall' | 'tower'
export type FinishId = 'graphite' | 'oak' | 'linen'

export interface CabinetConfig {
  kind: CabinetKind
  name: string
  width: number // mm
  height: number // mm
  depth: number // mm
  thickness: number // mm
  finish: FinishId
}

export interface PanelData {
  id: string
  label: string
  // Dimensões físicas e centro geométrico em milímetros.
  size: readonly [number, number, number]
  position: readonly [number, number, number]
  edge: 'carcass' | 'back'
}

export interface CabinetPreview {
  panels: PanelData[]
  width: number
  height: number
  depth: number
  estimatedAreaM2: number
}

export type PreviewResult = { ok: true; data: CabinetPreview } | { ok: false; errors: string[] }

export type AppView = 'home' | 'studio' | 'templates' | 'about'
