import { routes, routerOptions } from '@/router/index'

describe('Router Configuration', () => {
  test('Router uses history mode', () => {
    const history = routerOptions.history
    expect(history).toBeTruthy()
    expect(typeof history.push).toBe('function')
    expect(typeof history.replace).toBe('function')
    expect(typeof history.go).toBe('function')
  })

  test('Router has required routes', () => {
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
})
