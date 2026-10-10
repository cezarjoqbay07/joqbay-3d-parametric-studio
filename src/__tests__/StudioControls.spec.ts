import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StudioControls from '@/components/StudioControls.vue'
import { getPreset } from '@/application/studioPresets'

describe('StudioControls', () => {
  it('emits numeric dimensions without calculating geometry inside the form', async () => {
    const wrapper = mount(StudioControls, { props: { modelValue: getPreset('base') } })
    await wrapper.get('#dimension-width').setValue('1200')
    const update = wrapper.emitted('update:modelValue')?.slice(-1)[0]?.[0]
    expect(update).toMatchObject({ width: 1200, height: 760, depth: 560 })
  })

  it('switches presets when the cabinet kind changes', async () => {
    const wrapper = mount(StudioControls, { props: { modelValue: getPreset('base') } })
    await wrapper.get('#cabinet-kind').setValue('wall')
    const update = wrapper.emitted('update:modelValue')?.slice(-1)[0]?.[0]
    expect(update).toMatchObject({ kind: 'wall', width: 800, depth: 350 })
  })
})
