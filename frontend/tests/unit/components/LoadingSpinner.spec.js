import { mount } from '@vue/test-utils'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

describe('LoadingSpinner.vue', () => {
  test('renders with default props', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.find('.spinner-border').exists()).toBe(true)
    expect(wrapper.find('.spinner-border').classes()).not.toContain('spinner-border-sm')
    expect(wrapper.find('.sr-only').text()).toBe('Loading...')
  })

  test('applies size variants correctly', async () => {
    const wrapper = mount(LoadingSpinner, {
      props: { size: 'sm' }
    })
    
    expect(wrapper.find('.spinner-border').classes()).toContain('spinner-border-sm')
    
    await wrapper.setProps({ size: 'lg' })
    expect(wrapper.find('.spinner-border').classes()).toContain('spinner-border-lg')
  })

  test('shows custom loading text', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { loadingText: 'Loading...' }
    })
    
    expect(wrapper.find('.sr-only').text()).toBe('Loading...')
  })

  test('applies overlay mode correctly', () => {
    const wrapper = mount(LoadingSpinner, {
      props: { overlay: true }
    })
    
    const overlay = wrapper.find('.loading-spinner-wrapper')
    expect(overlay.exists()).toBe(true)
    expect(overlay.classes()).toContain('loading-overlay')
  })

  test('has proper ARIA attributes', () => {
    const wrapper = mount(LoadingSpinner)
    
    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.find('.sr-only').attributes('aria-live')).toBe('polite')
  })
})
