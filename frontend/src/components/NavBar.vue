<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container py-2">
      <RouterLink class="navbar-brand fw-bold" to="/">
        <span class="brand-text">Notes App</span>
      </RouterLink>
      
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item mx-2">
            <RouterLink class="nav-link" to="/" active-class="active">Home</RouterLink>
          </li>
          <template v-if="!isAuthenticated">
            <li class="nav-item mx-2">
              <RouterLink class="nav-link" to="/login" active-class="active">Login</RouterLink>
            </li>
            <li class="nav-item mx-2">
              <RouterLink class="nav-link" to="/register" active-class="active">Register</RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item mx-2">
              <RouterLink class="nav-link" to="/notes" active-class="active">My Notes</RouterLink>
            </li>
            <li class="nav-item mx-2">
              <a 
                class="nav-link" 
                href="#" 
                @click.prevent="handleLogout"
                :class="{ disabled: isLoggingOut }"
              >
                {{ isLoggingOut ? 'Logging out...' : 'Logout' }}
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/stores/auth'

export default {
  name: 'NavBar',
  setup() {
    const router = useRouter()
    const isLoggingOut = ref(false)
    const isAuthenticated = computed(() => !!auth.state.token)

    const handleLogout = async () => {
      if (isLoggingOut.value) return
      
      isLoggingOut.value = true
      try {
        await auth.logout()
        await router.push('/login')
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        isLoggingOut.value = false
      }
    }

    return {
      isAuthenticated,
      isLoggingOut,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease;
}

.navbar-brand {
  font-size: 1.4rem;
  transition: color 0.3s ease;
}

.brand-text {
  background: linear-gradient(45deg, var(--primary-color), var(--info-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.nav-link {
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding: 0.5rem 1rem;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 50%;
}

.nav-link.active::after {
  width: 100%;
}

.nav-link.disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* Mobile menu animations */
.navbar-collapse {
  transition: all 0.3s ease;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }
  
  .nav-item {
    margin: 0.5rem 0;
    text-align: center;
  }

  .nav-link::after {
    bottom: -4px;
  }
}
</style>