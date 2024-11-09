import { routes, routerOptions } from '@/router'

describe('Router Configuration', () => {
  test('Router uses history mode', () => {
    const history = routerOptions.history
    expect(history).toBeTruthy()
    expect(history.constructor.name).toBe('WebHistory')
  })

  test('Router has required routes', () => {
    const routeNames = routes.map(route => route.name)
    expect(routeNames).toContain('Home')
    expect(routeNames).toContain('Login')
  })

  test('Notes route requires authentication', () => {
    const notesRoute = routes.find(route => route.name === 'Notes')
    expect(notesRoute.meta.requiresAuth).toBe(true)
  })
}) 