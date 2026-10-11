import { describe, expect, it } from 'vitest'
import { createLocalCabinetPreview, DEMO_BACK_THICKNESS_MM } from './localPreviewAdapter'
import { getPreset } from './studioPresets'

function preview(config = getPreset('counter')) {
  const result = createLocalCabinetPreview(config)
  expect(result.ok).toBe(true)
  if (!result.ok) throw new Error(result.errors.join(', '))
  return result.data
}

describe('local cabinet preview — illustrative, not manufacturing authority', () => {
  it('keeps the top and bottom flush with side depth', () => {
    const data = preview()
    expect(data.panels.find((panel) => panel.id === 'top')?.size).toEqual([864, 18, 560])
    expect(data.panels.find((panel) => panel.id === 'bottom')?.size).toEqual([864, 18, 560])
  })

  it('uses a fixed 6 mm back separate from the structural board thickness', () => {
    const data = preview()
    expect(data.panels.find((panel) => panel.id === 'back')?.size).toEqual([
      864,
      724,
      DEMO_BACK_THICKNESS_MM,
    ])
    expect(DEMO_BACK_THICKNESS_MM).toBe(6)
  })

  it('allows horizontal panels to pass through and shortens the sides accordingly', () => {
    const config = getPreset('counter')
    config.structure = 'horizontal-through'
    const data = preview(config)
    expect(data.panels.find((panel) => panel.id === 'top')?.size).toEqual([900, 18, 560])
    expect(data.panels.find((panel) => panel.id === 'left')?.size).toEqual([18, 724, 560])
    expect(data.panels.find((panel) => panel.id === 'left')?.position[1]).toBe(380)
  })

  it('renders optional doors as distinct front panels', () => {
    expect(preview().panels.filter((panel) => panel.edge === 'front')).toHaveLength(2)
    const config = getPreset('counter')
    config.front = 'open'
    expect(preview(config).panels).toHaveLength(5)
  })

  it('renders three indicative drawer fronts, without claiming a drawer assembly', () => {
    const config = getPreset('counter')
    config.front = 'drawers'
    expect(
      preview(config).panels.filter((panel) => panel.id.startsWith('drawer-front')),
    ).toHaveLength(3)
  })

  it('rejects invalid dimensions and unknown structure options', () => {
    const config = getPreset('counter')
    expect(createLocalCabinetPreview({ ...config, width: NaN }).ok).toBe(false)
    expect(createLocalCabinetPreview({ ...config, width: -10 }).ok).toBe(false)
    expect(
      createLocalCabinetPreview({ ...config, structure: 'invalid' as typeof config.structure }).ok,
    ).toBe(false)
    expect(createLocalCabinetPreview({ ...config, name: '  ' }).ok).toBe(false)
  })
})
