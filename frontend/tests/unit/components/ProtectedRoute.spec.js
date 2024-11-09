import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import ProtectedRoute from '@/components/ProtectedRoute.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Mock vue-router
jest.mock('vue-router', () => ({
  useRouter: jest.fn()
}))

// Mock the auth store
const mockAuthStore = {
  isAuthenticated: false,
  checkAuth: jest.fn()
}

jest.mock('@/stores/auth', () => ({
  useAuthStore: () => mockAuthStore
}))

describe('ProtectedRoute.vue', () => {
  let wrapper
  let mockRouter

  const mountComponent = async () => {
    mockRouter = {
      push: jest.fn(),
      currentRoute: {
        value: { fullPath: '/' }
      }
    }
    useRouter.mockReturnValue(mockRouter)

    wrapper = mount(ProtectedRoute, {
      slots: {
        default: '<div data-test="content">Protected Content</div>'
      }
    })
    
    await nextTick()
    await flushPromises()
  }

  beforeEach(async () => {
    jest.clearAllMocks()
    mockAuthStore.isAuthenticated = false
    mockAuthStore.checkAuth.mockReset()
    await mountComponent()
  })

  test('shows loading state initially', async () => {
    mockAuthStore.checkAuth.mockImplementation(() => new Promise(() => {})) // Never resolves
    await mountComponent()
    
    expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="content"]').exists()).toBe(false)
  })

  test('renders slot content when authenticated', async () => {
    mockAuthStore.isAuthenticated = true
    mockAuthStore.checkAuth.mockResolvedValue(true)
    await mountComponent()
    await flushPromises()

    expect(wrapper.find('[data-test="loading-spinner"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="content"]').exists()).toBe(true)
  })

  test('redirects to login when not authenticated', async () => {
    mockAuthStore.checkAuth.mockResolvedValue(false)
    await mountComponent()
    await flushPromises()

    expect(mockRouter.push).toHaveBeenCalledWith({
      path: '/login',
      query: { redirect: '/' }
    })
  })

  test('handles authentication errors gracefully', async () => {
    mockAuthStore.checkAuth.mockRejectedValue(new Error('Auth Error'))
    await mountComponent()
    await flushPromises()

    expect(wrapper.find('[data-test="error-message"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="error-message"]').text())
      .toContain('Authentication error')
  })
})
