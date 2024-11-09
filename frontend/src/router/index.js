import { h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import NotesView from '../views/Notes.vue'
import ProtectedRoute from '@/components/ProtectedRoute.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: {
      render() {
        return h(ProtectedRoute, null, {
          default: () => h(NotesView)
        })
      }
    },
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()
  
  try {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
    const isAuthenticated = await auth.checkAuth()

    if (requiresAuth && !isAuthenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    if (requiresGuest && isAuthenticated) {
      next('/notes')
      return
    }

    next()
  } catch (error) {
    console.error('Navigation guard error:', error)
    auth.logout()
    next('/login')
  }
})

export default router