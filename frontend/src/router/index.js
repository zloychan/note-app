import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import NotesView from '../views/Notes.vue'
import auth from '@/stores/auth'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'Home',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      title: 'Login',
      requiresAuth: false,
      redirectIfAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: {
      title: 'Register',
      requiresAuth: false,
      redirectIfAuth: true
    }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: NotesView,
    meta: {
      title: 'My Notes',
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      requiresAuth: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  // Set document title
  document.title = `${to.meta.title} - Notes App`

  try {
    const isAuthenticated = await auth.checkAuth()

    // Handle authentication requirements
    if (to.meta.requiresAuth && !isAuthenticated) {
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // Redirect authenticated users from login/register pages
    if (to.meta.redirectIfAuth && isAuthenticated) {
      next('/notes')
      return
    }

    next()
  } catch (error) {
    console.error('Navigation error:', error)
    next('/login')
  }
})

// Add route transition handling
router.afterEach(() => {
  // Scroll to top after route change
  window.scrollTo(0, 0)
})

export default router