import { reactive, readonly } from 'vue'
import api from '@/services/api'

const state = reactive({
  token: localStorage.getItem('token') || null,
  user: null,
  loading: false,
  error: null
})

const actions = {
  setToken(token) {
    state.token = token
    if (token) {
      localStorage.setItem('token', token)
      // Set token in axios defaults for authenticated requests
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  },

  setUser(user) {
    state.user = user
  },

  async login(credentials) {
    state.loading = true
    state.error = null
    try {
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/login', credentials)
      const dummyToken = 'dummy-token'
      this.setToken(dummyToken)
      this.setUser({ email: credentials.email })
      return true
    } catch (error) {
      state.error = error.response?.data?.message || 'Login failed'
      return false
    } finally {
      state.loading = false
    }
  },

  async register(credentials) {
    state.loading = true
    state.error = null
    try {
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 100))
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/register', credentials)
      return true
    } catch (error) {
      state.error = error.response?.data?.message || 'Registration failed'
      return false
    } finally {
      state.loading = false
    }
  },

  async logout() {
    this.setToken(null)
    this.setUser(null)
  },

  async checkAuth() {
    if (!state.token) return false
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/auth/me')
      // this.setUser(response.data)
      return true
    } catch (error) {
      this.logout()
      return false
    }
  }
}

export default {
  state: readonly(state),
  ...actions
}