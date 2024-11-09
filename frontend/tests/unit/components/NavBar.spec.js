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
