import { ref } from 'vue'
import auth from '@/stores/auth'
import { jwtDecode } from 'jwt-decode'

// Reactive state for auth checking
const isCheckingAuth = ref(false)

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true
  try {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    console.error('Token validation error:', error)
    return true
  }
}

// Validate current authentication status
const validateAuth = async () => {
  isCheckingAuth.value = true
  try {
    const token = auth.state.token
    
    // Check if token exists and is not expired
    if (!token || isTokenExpired(token)) {
      auth.logout()
      return false
    }

    // Verify token with backend
    const isValid = await auth.checkAuth()
    if (!isValid) {
      auth.logout()
      return false
    }

    return true
  } catch (error) {
    console.error('Auth validation error:', error)
    auth.logout()
    return false
  } finally {
    isCheckingAuth.value = false
  }
}

// Check if user can access protected route
const requireAuth = async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    isCheckingAuth.value = true
    try {
      const isAuthenticated = await validateAuth()
      if (!isAuthenticated) {
        next({ 
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
      next()
    } catch (error) {
      console.error('Navigation guard error:', error)
      next('/login')
    } finally {
      isCheckingAuth.value = false
    }
  } else {
    next()
  }
}

// Handle authentication for API requests
const getAuthHeader = () => {
  const token = auth.state.token
  if (token && !isTokenExpired(token)) {
    return `Bearer ${token}`
  }
  return null
}

export {
  isCheckingAuth,
  validateAuth,
  requireAuth,
  getAuthHeader,
  isTokenExpired
}
