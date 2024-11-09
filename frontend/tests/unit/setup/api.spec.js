import api from '@/services/api'

describe('Axios Configuration', () => {
  test('API base URL is correctly configured', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:8000')
  })

  test('API has correct default headers', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json')
  })
})
