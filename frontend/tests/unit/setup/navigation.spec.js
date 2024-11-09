import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'
import auth from '@/stores/auth'

jest.mock('@/stores/auth', () => ({
  checkAuth: jest.fn()
}))

describe('Navigation Guards', () => {
  let router

  beforeEach(() => {
    jest.clearAllMocks()
    router = createRouter({
      history: createWebHistory(),
      routes
    })

    router.beforeEach(async (to, from, next) => {
      if (to.meta.requiresAuth) {
        const isAuthenticated = await auth.checkAuth()
        if (!isAuthenticated) {
          next('/login')
          return
        }
      }
      next()
    })
  })

  test('Unauthenticated user is redirected from notes to login', async () => {
    auth.checkAuth.mockResolvedValue(false)
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  test('Authenticated user can access notes page', async () => {
    auth.checkAuth.mockResolvedValue(true)
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/notes')
  })

  test('Public routes are accessible without authentication check', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
    expect(auth.checkAuth).not.toHaveBeenCalled()

    await router.push('/register')
    expect(router.currentRoute.value.path).toBe('/register')
    expect(auth.checkAuth).not.toHaveBeenCalled()

    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
    expect(auth.checkAuth).not.toHaveBeenCalled()
  })
})
