import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Register from '@/views/Register.vue'

describe('Register.vue', () => {
  let router
  let wrapper

  beforeEach(() => {
    // Create a fresh router instance for each test
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'Home',
          component: { template: '<div>Home</div>' }
        },
        {
          path: '/register',
          name: 'Register',
          component: Register
        },
        {
          path: '/login',
          name: 'Login',
          component: { template: '<div>Login</div>' }
        }
      ]
    })
    
    wrapper = mount(Register, {
      global: {
        plugins: [router],
        stubs: {
          'router-link': true
        }
      }
    })
  })

  test('renders register form correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Register')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.findAll('input')).toHaveLength(3)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Register')
  })

  test('initializes with empty form data', () => {
    expect(wrapper.vm.form.email).toBe('')
    expect(wrapper.vm.form.password).toBe('')
    expect(wrapper.vm.form.confirmPassword).toBe('')
  })

  test('validates email format', async () => {
    const emailInput = wrapper.find('input[type="email"]')
    await emailInput.setValue('invalid-email')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.email).toBe('Please enter a valid email address')
  })

  test('validates required fields', async () => {
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.email).toBe('Email is required')
    expect(wrapper.vm.errors.password).toBe('Password is required')
  })

  test('validates password length', async () => {
    const passwordInput = wrapper.find('input[id="password"]')
    await passwordInput.setValue('short')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.password).toBe('Password must be at least 8 characters')
  })

  test('validates password matching', async () => {
    await wrapper.find('input[id="password"]').setValue('password123')
    await wrapper.find('input[id="confirmPassword"]').setValue('password456')
    await wrapper.find('form').trigger('submit.prevent')
    
    expect(wrapper.vm.errors.confirmPassword).toBe('Passwords do not match')
  })

  test('shows loading state during form submission', async () => {
    const validForm = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    await wrapper.find('input[type="email"]').setValue(validForm.email)
    await wrapper.find('input[id="password"]').setValue(validForm.password)
    await wrapper.find('input[id="confirmPassword"]').setValue(validForm.confirmPassword)
    
    const submitButton = wrapper.find('button[type="submit"]')
    await wrapper.find('form').trigger('submit.prevent')
    
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.loading).toBe(true)
    expect(submitButton.text()).toBe('Registering...')
  })

  test('navigates to login page after successful registration', async () => {
    const push = jest.spyOn(router, 'push')
    const validForm = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }

    await wrapper.find('input[type="email"]').setValue(validForm.email)
    await wrapper.find('input[id="password"]').setValue(validForm.password)
    await wrapper.find('input[id="confirmPassword"]').setValue(validForm.confirmPassword)
    await wrapper.find('form').trigger('submit.prevent')
    
    // Wait for the simulated API call to complete
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 150))
    
    expect(push).toHaveBeenCalledWith('/login')
  })
})
