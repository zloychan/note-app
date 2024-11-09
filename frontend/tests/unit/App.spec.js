import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { createRouter, createWebHistory } from 'vue-router'

describe('App.vue', () => {
  let wrapper
  let router

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } }
      ]
    })

    wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
  })

  test('uses Bootstrap container system', () => {
    expect(wrapper.find('.container').exists()).toBe(true)
  })

  test('applies responsive breakpoints', () => {
    const container = wrapper.find('.container')
    const styles = window.getComputedStyle(container.element)
    
    expect(styles.maxWidth).toBe('1200px')
    expect(styles.padding).toBe('1rem')
  })

  test('maintains consistent spacing across devices', () => {
    const mainContent = wrapper.find('main')
    const styles = window.getComputedStyle(mainContent.element)
    
    expect(styles.padding).toBe('1rem')
    expect(styles.marginBottom).toBe('1rem')
  })

  test('applies responsive typography', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    
    const app = wrapper.find('#app')
    const styles = window.getComputedStyle(app.element)
    
    expect(styles.fontFamily).toBe('Avenir, Helvetica, Arial, sans-serif')
    expect(styles.fontSize).toBe('1rem')
  })
})
