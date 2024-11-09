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

describe('App Component', () => {
  beforeEach(async () => {
    await router.push('/')
    await router.isReady()
  })

  test('App contains navigation bar', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    expect(wrapper.find('nav').exists()).toBe(true)
  })

  test('Navigation contains all required links', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    const links = wrapper.findAll('router-link-stub')
    const linkTo = links.map(link => link.attributes('to'))
    
    expect(linkTo).toContain('/')
    expect(linkTo).toContain('/login')
    expect(linkTo).toContain('/register')
  })

  test('App contains main content area', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: {
          'router-view': true,
          'router-link': true
        }
      }
    })
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.find('main').classes()).toContain('container')
  })
})
