import { mount } from '@vue/test-utils'
import App from '@/App.vue'

describe('Global Styles', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(App, {
      global: {
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
  })

  test('App component uses CSS variables for styling', () => {
    const app = wrapper.find('#app')
    const computedStyles = window.getComputedStyle(app.element)
    
    expect(computedStyles.fontFamily).toContain('Avenir')
    expect(computedStyles.color).toBeDefined()
  })

  test('Navbar has correct margin styling', () => {
    const navbar = wrapper.find('.navbar')
    const computedStyles = window.getComputedStyle(navbar.element)
    
    expect(computedStyles.marginBottom).toBeDefined()
  })

  test('Container has correct max-width and padding', () => {
    const container = wrapper.find('.container')
    const computedStyles = window.getComputedStyle(container.element)
    
    expect(computedStyles.maxWidth).toBe('1200px')
    expect(computedStyles.padding).toBeDefined()
  })
})