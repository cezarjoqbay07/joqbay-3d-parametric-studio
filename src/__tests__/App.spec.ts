import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

// O teste de interface não depende de uma GPU/WebGL real.
vi.mock('@/components/CabinetViewport.vue', () => ({
  default: { template: '<div data-testid="mock-viewport">3D</div>' },
}))

describe('App shell', () => {
  vi.stubGlobal('scrollTo', vi.fn())
  it('shows the landing page and navigates to the configurator', async () => {
    window.location.hash = '#home'
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Projetar é transformar')
    await wrapper.get('.hero-content .primary-button').trigger('click')
    expect(wrapper.text()).toContain('Configurador 3D')
    expect(wrapper.find('[data-testid="mock-viewport"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('switches visual themes without touching the cabinet configuration', async () => {
    window.location.hash = '#home'
    const wrapper = mount(App)
    await wrapper.get('.theme-switch').trigger('click')
    expect(['dark', 'light']).toContain(document.documentElement.dataset.theme)
    wrapper.unmount()
  })
})
