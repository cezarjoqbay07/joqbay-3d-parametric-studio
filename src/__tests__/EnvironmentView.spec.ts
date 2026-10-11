import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import EnvironmentView from '@/views/EnvironmentView.vue'

vi.mock('@/components/CabinetViewport.vue', () => ({
  default: { template: '<div data-testid="mock-viewport">3D</div>' },
}))

describe('EnvironmentView', () => {
  it('shows a kitchen composition with four independent editable modules', async () => {
    const wrapper = mount(EnvironmentView)
    expect(wrapper.find('[data-testid="mock-viewport"]').exists()).toBe(true)
    expect(wrapper.findAll('.environment-module')).toHaveLength(4)
    await wrapper.findAll('.environment-module')[1]!.trigger('click')
    expect((wrapper.get('#room-width').element as HTMLInputElement).value).toBe('600')
    await wrapper.get('#room-width').setValue('750')
    expect(wrapper.findAll('.environment-module')[1]!.text()).toContain('750')
    expect(wrapper.findAll('.environment-module')[0]!.text()).toContain('900')
    wrapper.unmount()
  })

  it('restores original values when reset is requested', async () => {
    const wrapper = mount(EnvironmentView)
    await wrapper.get('#room-width').setValue('1200')
    await wrapper.get('.environment-reset').trigger('click')
    expect((wrapper.get('#room-width').element as HTMLInputElement).value).toBe('900')
    wrapper.unmount()
  })
})
