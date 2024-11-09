<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <RouterLink class="navbar-brand" to="/">Notes App</RouterLink>
      <button 
        class="navbar-toggler" 
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
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="active" to="/">Home</RouterLink>
          </li>
          <Transition name="fade" mode="out-in">
            <template v-if="!isAuthenticated">
              <div class="d-flex">
                <li class="nav-item">
                  <RouterLink class="nav-link" active-class="active" to="/login">Login</RouterLink>
                </li>
                <li class="nav-item">
                  <RouterLink class="nav-link" active-class="active" to="/register">Register</RouterLink>
                </li>
              </div>
            </template>
            <template v-else>
              <div class="d-flex">
                <li class="nav-item">
                  <RouterLink class="nav-link" active-class="active" to="/notes">My Notes</RouterLink>
                </li>
                <li class="nav-item">
                  <a 
                    class="nav-link" 
                    href="#" 
                    @click.prevent="handleLogout"
                    :class="{ 'disabled': isLoggingOut }"
                  >
                    <span v-if="isLoggingOut" class="spinner-border spinner-border-sm me-1"></span>
                    Logout
                  </a>
                </li>
              </div>
            </template>
          </Transition>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
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
}

.nav-link {
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link.active::after {
  width: 100%;
}

.nav-link.disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* Fade transition for auth state changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding: 1rem 0;
  }
  
  .nav-item {
    margin: 0.5rem 0;
  }
}
</style>