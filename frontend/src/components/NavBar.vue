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
            <template v-if="!isAuthenticated">
              <li class="nav-item">
                <RouterLink class="nav-link" active-class="active" to="/login">Login</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" active-class="active" to="/register">Register</RouterLink>
              </li>
            </template>
            <template v-else>
              <li class="nav-item">
                <RouterLink class="nav-link" active-class="active" to="/notes">My Notes</RouterLink>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" @click.prevent="handleLogout">Logout</a>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import auth from '@/stores/auth'
  
  export default {
    name: 'NavBar',
    setup() {
      const router = useRouter()
      const isAuthenticated = computed(() => !!auth.state.token)
  
      const handleLogout = async () => {
        await auth.logout()
        router.push('/login')
      }
  
      return {
        isAuthenticated,
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
  }
  
  .nav-link.active {
    font-weight: bold;
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