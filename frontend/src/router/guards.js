import { useAuthStore } from '@/stores/auth'

export function setupRouteGuards(router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore()

    // Handle routes that require guest access
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/notes')
      return
    }

    // Handle routes that require authentication
    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
        return
      }
    }

    next()
  })
}