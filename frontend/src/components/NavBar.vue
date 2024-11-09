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
            <RouterLink class="nav-link" to="/" active-class="active">Home</RouterLink>
          </li>
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login" active-class="active">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register" active-class="active">Register</RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/notes" active-class="active">My Notes</RouterLink>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="handleLogout" 
                 :class="{ disabled: isLoggingOut }">
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
</style>