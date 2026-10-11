import { describe, expect, it } from 'vitest'
import { createKitchenModules, createKitchenPreview } from './kitchenComposition'

function data() {
  const result = createKitchenPreview(createKitchenModules())
  expect(result.ok).toBe(true)
  if (!result.ok) throw new Error(result.errors.join(', '))
  return result.data
}

describe('kitchen composition preview', () => {
  it('combines independent module panels, preserving module prefixes', () => {
    const panels = data().panels
    expect(new Set(panels.map((panel) => panel.id.split('/')[0]))).toEqual(
      new Set(['counter', 'drawers', 'fridge-tower', 'wall']),
    )
    expect(panels.some((panel) => panel.id === 'drawers/drawer-front-2')).toBe(true)
  })
  it('puts the aerial unit above the floor modules', () => {
    const panels = data().panels
    const aerial = panels.find((panel) => panel.id === 'wall/bottom')!
    expect(aerial.position[1]).toBeGreaterThan(1500)
  })
  it('recomputes composition width after editing a single module', () => {
    const modules = createKitchenModules()
    const before = createKitchenPreview(modules)
    modules[1]!.config.width += 150
    const after = createKitchenPreview(modules)
    expect(before.ok && after.ok).toBe(true)
    if (before.ok && after.ok) expect(after.data.width - before.data.width).toBe(150)
  })
  it('does not contaminate other modules when editing a selected configuration', () => {
    const modules = createKitchenModules()
    modules[0]!.config.finish = 'white'
    expect(modules[1]!.config.finish).toBe('linen')
  })
  it('returns a validation error instead of sending invalid geometry to Three.js', () => {
    const modules = createKitchenModules()
    modules[0]!.config.height = -1
    const result = createKitchenPreview(modules)
    expect(result.ok).toBe(false)
  })
})
