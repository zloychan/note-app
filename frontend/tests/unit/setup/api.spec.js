import api from '@/services/api'
import auth from '@/stores/auth'
import router from '@/router'

jest.mock('@/stores/auth', () => ({
  state: {
    token: null
  },
  logout: jest.fn()
}))

jest.mock('@/router', () => ({
  push: jest.fn()
}))

describe('API Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('API base URL is correctly configured', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:8000')
  })

  test('API has correct default headers', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })

  test('Adds authorization header when token exists', async () => {
    auth.state.token = 'test-token'
    const config = await api.interceptors.request.handlers[0].fulfilled({
      headers: {}
    })
    expect(config.headers.Authorization).toBe('Bearer test-token')
  })

  test('Handles 401 response with logout and redirect', async () => {
    const error = {
      response: { status: 401 }
    }
    try {
      await api.interceptors.response.handlers[0].rejected(error)
    } catch (e) {
      expect(auth.logout).toHaveBeenCalled()
      expect(router.push).toHaveBeenCalledWith('/login')
    }
  })
})
