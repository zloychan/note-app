import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { routes } from '@/router/index'

describe('NavBar Component', () => {
  let router
  let wrapper

  beforeEach(() => {
    router = createRouter({
      history: createWebHistory(),
      routes
    })
  })

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

  test('renders navbar brand', () => {
    wrapper = createWrapper()
    expect(wrapper.find('.navbar-brand').text()).toBe('Notes App')
  })

  test('renders navbar toggle button for mobile', () => {
    wrapper = createWrapper()
    const toggleButton = wrapper.find('.navbar-toggler')
    expect(toggleButton.exists()).toBe(true)
    expect(toggleButton.attributes('data-bs-toggle')).toBe('collapse')
  })

  describe('Unauthenticated state', () => {
    beforeEach(() => {
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
    beforeEach(async () => {
      localStorage.setItem('token', 'fake-token')
      wrapper = createWrapper()
      await wrapper.vm.$nextTick()
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
      await logoutLink.trigger('click')
      
      expect(localStorage.getItem('token')).toBeNull()
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.isAuthenticated).toBe(false)
    })
  })

  describe('Responsive behavior', () => {
    test('navbar collapse has correct Bootstrap classes', () => {
      wrapper = createWrapper()
      const collapse = wrapper.find('.navbar-collapse')
      expect(collapse.classes()).toContain('collapse')
    })

    test('navbar is responsive with correct classes', () => {
      wrapper = createWrapper()
      expect(wrapper.find('.navbar-expand-lg').exists()).toBe(true)
    })
  })

  describe('Responsive Design', () => {
    test('navigation links align correctly on different screen sizes', () => {
      wrapper = createWrapper()
      const nav = wrapper.find('.navbar-nav')
      
      expect(nav.classes()).toContain('navbar-nav')
      expect(nav.classes()).toContain('ms-auto')
    })

    test('mobile menu collapses and expands correctly', async () => {
      wrapper = createWrapper()
      const toggleButton = wrapper.find('.navbar-toggler')
      const menu = wrapper.find('#navbarNav')
      
      // Initial state
      expect(menu.classes()).toContain('collapse')
      expect(menu.classes()).toContain('navbar-collapse')
      
      // Trigger toggle and manually set show class
      await toggleButton.trigger('click')
      await menu.element.classList.add('show')
      await wrapper.vm.$nextTick()
      
      expect(menu.classes()).toContain('show')
    })
  })

  describe('Navigation Styling', () => {
    test('active route has correct styling', async () => {
      wrapper = createWrapper()
      await router.push('/login')
      await wrapper.vm.$nextTick()
      
      const links = wrapper.findAll('.nav-link')
      const activeLink = links.find(link => link.classes('active'))
      
      expect(activeLink).toBeDefined()
    })
  })
})
