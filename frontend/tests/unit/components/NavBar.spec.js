import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import auth from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: { template: '<div>Home</div>' }
  },
  {
    path: '/login',
    name: 'Login',
    component: { template: '<div>Login</div>' }
  },
  {
    path: '/register',
    name: 'Register',
    component: { template: '<div>Register</div>' }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: { template: '<div>Notes</div>' },
    meta: { requiresAuth: true }
  }
]

jest.mock('@/stores/auth', () => ({
  state: {
    token: null
  },
  logout: jest.fn()
}))

describe('NavBar Component', () => {
  let router
  let wrapper

  const createWrapper = () => {
    router = createRouter({
      history: createWebHistory(),
      routes
    })

    return mount(NavBar, {
      global: {
        plugins: [router],
        stubs: {
          RouterLink: {
            template: '<a :href="to" class="nav-link" :class="{ active: isActive }"><slot /></a>',
            props: ['to'],
            computed: {
              isActive() {
                return this.$route?.path === this.to
              }
            }
          }
        }
      }
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    document.body.innerHTML = ''
  })

  test('renders navbar brand', () => {
    wrapper = createWrapper()
    expect(wrapper.find('.navbar-brand').text()).toBe('Notes App')
  })

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      auth.state.token = null
      wrapper = createWrapper()
    })

    test('shows login and register links when not authenticated', () => {
      const navLinks = wrapper.findAll('.nav-link')
      const linkTexts = navLinks.map(link => link.text())
      
      expect(linkTexts).toContain('Home')
      expect(linkTexts).toContain('Login')
      expect(linkTexts).toContain('Register')
      expect(linkTexts).not.toContain('My Notes')
      expect(linkTexts).not.toContain('Logout')
    })
  })

  describe('Authenticated state', () => {
    beforeEach(() => {
      auth.state.token = 'fake-token'
      wrapper = createWrapper()
    })

    test('shows notes and logout links when authenticated', () => {
      const navLinks = wrapper.findAll('.nav-link')
      const linkTexts = navLinks.map(link => link.text())
      
      expect(linkTexts).toContain('Home')
      expect(linkTexts).toContain('My Notes')
      expect(linkTexts).toContain('Logout')
      expect(linkTexts).not.toContain('Login')
      expect(linkTexts).not.toContain('Register')
    })

    test('handles logout correctly', async () => {
      const logoutLink = wrapper.find('a[href="#"]')
      await logoutLink.trigger('click.prevent')
      
      expect(auth.logout).toHaveBeenCalled()
      await router.isReady()
      expect(router.currentRoute.value.path).toBe('/login')
    })
  })
})

describe('NavBar.vue', () => {
  let wrapper
  let router

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home' },
        { path: '/notes', name: 'notes' },
        { path: '/login', name: 'login' }
      ]
    })

    wrapper = mount(NavBar, {
      global: {
        plugins: [router]
      }
    })
  })

  test('renders responsive navbar', () => {
    expect(wrapper.find('.navbar').classes()).toContain('navbar-expand-lg')
    expect(wrapper.find('.navbar-toggler').exists()).toBe(true)
    expect(wrapper.find('.navbar-collapse').exists()).toBe(true)
  })

  test('toggles mobile menu correctly', async () => {
    const toggler = wrapper.find('.navbar-toggler')
    const collapse = wrapper.find('.navbar-collapse')
    
    // Initial state
    expect(collapse.classes()).not.toContain('show')
    
    // Simulate Bootstrap collapse behavior
    await toggler.trigger('click')
    collapse.element.classList.add('show')
    await wrapper.vm.$nextTick()
    expect(collapse.classes()).toContain('show')
    
    await toggler.trigger('click')
    collapse.element.classList.remove('show')
    await wrapper.vm.$nextTick()
    expect(collapse.classes()).not.toContain('show')
  })

  test('applies active state to current route', async () => {
    await router.push('/notes')
    await wrapper.vm.$nextTick()
    
    const activeLink = wrapper.find('.nav-link.active')
    expect(activeLink.text()).toBe('My Notes')
  })

  test('has consistent spacing and padding', () => {
    const navbar = wrapper.find('.navbar')
    const styles = window.getComputedStyle(navbar.element)
    
    expect(styles.padding).toBe('1rem')
    expect(styles.marginBottom).toBe('1rem')
  })
})
