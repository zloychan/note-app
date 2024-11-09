import { beforeEach, describe, expect, test } from '@jest/globals'
import { createRouter, createWebHistory } from 'vue-router'
import { setupRouteGuards } from '@/router/guards'
import { useAuthStore } from '@/stores/auth'

// Mock the auth store
const mockAuthStore = {
  isAuthenticated: false
}

jest.mock('@/stores/auth', () => ({
  useAuthStore: jest.fn(() => mockAuthStore)
}))

describe('Route Guards', () => {
  let router

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()
    
    // Create a test router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/login',
          name: 'login',
          component: { template: '<div>Login</div>' },
          meta: { requiresGuest: true }
        },
        {
          path: '/notes',
          name: 'notes',
          component: { template: '<div>Notes</div>' },
          meta: { requiresAuth: true }
        }
      ]
    })
    
    // Setup route guards
    setupRouteGuards(router)
  })

  test('allows access to public routes without authentication', async () => {
    mockAuthStore.isAuthenticated = false
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  test('redirects to login when accessing protected route without auth', async () => {
    mockAuthStore.isAuthenticated = false
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  test('allows access to protected routes when authenticated', async () => {
    mockAuthStore.isAuthenticated = true
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/notes')
  })

  test('redirects to notes when accessing login while authenticated', async () => {
    mockAuthStore.isAuthenticated = true
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/notes')
  })
})