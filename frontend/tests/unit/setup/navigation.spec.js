import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index'

describe('Navigation Guards', () => {
  let router

  beforeEach(() => {
    localStorage.clear()
    router = createRouter({
      history: createWebHistory(),
      routes
    })

    router.beforeEach((to, from, next) => {
      const isAuthenticated = localStorage.getItem('token')
      if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
      } else {
        next()
      }
    })
  })

  test('Unauthenticated user is redirected from notes to login', async () => {
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/login')
  })

  test('Authenticated user can access notes page', async () => {
    localStorage.setItem('token', 'fake-token')
    await router.push('/notes')
    expect(router.currentRoute.value.path).toBe('/notes')
  })

  test('Public routes are accessible without authentication', async () => {
    await router.push('/login')
    expect(router.currentRoute.value.path).toBe('/login')

    await router.push('/register')
    expect(router.currentRoute.value.path).toBe('/register')

    await router.push('/')
    expect(router.currentRoute.value.path).toBe('/')
  })
})
