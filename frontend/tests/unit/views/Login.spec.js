import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import { routes } from '@/router/index'

describe('Login.vue', () => {
  let router
  let wrapper

  beforeEach(() => {
    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn()
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: { template: '<div>Home</div>' }
        },
        {
          path: '/login',
          name: 'Login',
          component: Login
        },
        {
          path: '/notes',
          name: 'Notes',
          component: { template: '<div>Notes</div>' }
        }
      ]
    })
    
    wrapper = mount(Login, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })
  })

  test('renders login form correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Login')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input')).toHaveLength(2)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Login')
  })

  test('validates required fields', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.vm.errors.email).toBe('Email is required')
    expect(wrapper.vm.errors.password).toBe('Password is required')
  })

  test('handles successful login', async () => {
    const push = jest.spyOn(router, 'push')
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[id="password"]').setValue('password123')
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for the simulated API call to complete
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'dummy-token')
    expect(push).toHaveBeenCalledWith('/notes')
  })

  test('shows loading state during submission', async () => {
    const validForm = {
      email: 'test@example.com',
      password: 'password123'
    }

    await wrapper.find('input[type="email"]').setValue(validForm.email)
    await wrapper.find('input[type="password"]').setValue(validForm.password)
    
    const submitButton = wrapper.find('button[type="submit"]')
    await wrapper.find('form').trigger('submit.prevent')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.loading).toBe(true)
    expect(submitButton.text()).toBe('Logging in...')
  })
})