import { beforeEach, describe, expect, jest, test } from '@jest/globals'
import { validateAuth, isTokenExpired } from '@/utils/authGuard'
import auth from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'

// Mock dependencies
jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}))

jest.mock('@/stores/auth', () => ({
  state: {
    token: null
  },
  logout: jest.fn(),
  checkAuth: jest.fn()
}))

describe('Auth Guard Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('validateAuth', () => {
    test('returns false when no token exists', async () => {
      auth.state.token = null
      expect(await validateAuth()).toBe(false)
    })

    test('returns false when token is expired', async () => {
      auth.state.token = 'expired-token'
      jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 3600 }) // expired 1 hour ago
      expect(await validateAuth()).toBe(false)
      expect(auth.logout).toHaveBeenCalled()
    })

    test('returns true for valid token and successful auth check', async () => {
      auth.state.token = 'valid-token'
      jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 }) // expires in 1 hour
      auth.checkAuth.mockResolvedValue(true)
      expect(await validateAuth()).toBe(true)
    })

    test('handles backend auth check failure', async () => {
      auth.state.token = 'valid-token'
      jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 })
      auth.checkAuth.mockResolvedValue(false)
      expect(await validateAuth()).toBe(false)
      expect(auth.logout).toHaveBeenCalled()
    })
  })

  describe('isTokenExpired', () => {
    test('returns true for expired token', () => {
      jwtDecode.mockReturnValue({ exp: Date.now() / 1000 - 3600 })
      expect(isTokenExpired('expired-token')).toBe(true)
    })

    test('returns false for valid token', () => {
      jwtDecode.mockReturnValue({ exp: Date.now() / 1000 + 3600 })
      expect(isTokenExpired('valid-token')).toBe(false)
    })

    test('returns true for invalid token format', () => {
      jwtDecode.mockImplementation(() => { throw new Error('Invalid token') })
      expect(isTokenExpired('invalid-token')).toBe(true)
    })

    test('returns true for null/undefined token', () => {
      expect(isTokenExpired(null)).toBe(true)
      expect(isTokenExpired(undefined)).toBe(true)
    })
  })
})