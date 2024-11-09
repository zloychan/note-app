import { routes, default as router } from '@/router/index'

describe('Router Configuration', () => {
  test('Router has all required routes', () => {
    const routeNames = routes.map(route => route.name)
    expect(routeNames).toContain('Home')
    expect(routeNames).toContain('Login')
    expect(routeNames).toContain('Register')
    expect(routeNames).toContain('Notes')
  })

  test('Notes route requires authentication', () => {
    const notesRoute = routes.find(route => route.name === 'Notes')
    expect(notesRoute.meta.requiresAuth).toBe(true)
  })

  test('Routes have correct paths', () => {
    const homeRoute = routes.find(route => route.name === 'Home')
    const loginRoute = routes.find(route => route.name === 'Login')
    const registerRoute = routes.find(route => route.name === 'Register')
    const notesRoute = routes.find(route => route.name === 'Notes')

    expect(homeRoute.path).toBe('/')
    expect(loginRoute.path).toBe('/login')
    expect(registerRoute.path).toBe('/register')
    expect(notesRoute.path).toBe('/notes')
  })
})
