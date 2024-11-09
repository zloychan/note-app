import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '@/App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div>Home</div>' }
    }
  ]
})

describe('App Initialization', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  test('App component can be mounted', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  test('App contains router view', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    expect(wrapper.html()).toContain('router-view-stub')
  })
})
