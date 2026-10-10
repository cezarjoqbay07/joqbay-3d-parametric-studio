import { describe, expect, it } from 'vitest'
import { createLocalCabinetPreview } from './localPreviewAdapter'
import { getPreset } from './studioPresets'

describe('local preview adapter — conceptual geometry', () => {
  it('generates five independent panels for the default base cabinet', () => {
    const result = createLocalCabinetPreview(getPreset('base'))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.panels.map((part) => part.id)).toEqual([
      'left',
      'right',
      'bottom',
      'top',
      'back',
    ])
    expect(result.data.panels.find((part) => part.id === 'bottom')?.size).toEqual([864, 18, 542])
  })

  it('recalculates the bottom width when the requested width changes', () => {
    const config = getPreset('base')
    config.width = 1200
    const result = createLocalCabinetPreview(config)
    expect(result.ok).toBe(true)
    if (result.ok)
      expect(result.data.panels.find((part) => part.id === 'bottom')?.size[0]).toBe(1164)
  })

  it.each([0, -10, Number.NaN, Number.POSITIVE_INFINITY])('rejects invalid widths: %s', (width) => {
    const result = createLocalCabinetPreview({ ...getPreset('base'), width })
    expect(result.ok).toBe(false)
  })

  it('rejects missing names', () => {
    expect(createLocalCabinetPreview({ ...getPreset('base'), name: '  ' }).ok).toBe(false)
  })

  it('keeps rendering geometry separate from the backend contract', () => {
    const result = createLocalCabinetPreview(getPreset('tower'))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.data.panels.every((panel) => panel.size.every(Number.isFinite))).toBe(true)
  })
})
