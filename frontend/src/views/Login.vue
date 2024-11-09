<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Login</h2>
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Email address</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input 
                    type="email" 
                    class="form-control"
                    id="email"
                    v-model="form.email"
                    :class="{ 'is-invalid': errors.email }"
                    placeholder="Enter your email"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.email">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input 
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    placeholder="Enter your password"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.password">
                    {{ errors.password }}
                  </div>
                </div>
              </div>

              <div class="alert alert-danger" v-if="errors.general">
                {{ errors.general }}
              </div>

              <div class="d-grid gap-2">
                <button 
                  type="submit" 
                  class="btn btn-primary py-2"
                  :disabled="loading"
                >
                  <span 
                    class="spinner-border spinner-border-sm me-2" 
                    v-if="loading"
                  ></span>
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>

              <div class="text-center mt-3">
                <p class="mb-0">
                  Don't have an account? 
                  <router-link to="/register" class="text-primary text-decoration-none">
                    Register here
                  </router-link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/stores/auth'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const loading = computed(() => auth.state.loading)
    const form = reactive({
      email: '',
      password: ''
    })
    const errors = reactive({
      email: '',
      password: '',
      general: ''
    })

    const validateForm = () => {
      let isValid = true
      Object.keys(errors).forEach(key => errors[key] = '')

      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      }

      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      }

      return isValid
    }

    const handleSubmit = async () => {
      if (!validateForm()) return

      try {
        const success = await auth.login({
          username: form.email,
          password: form.password
        })
        
        if (success) {
          router.push('/notes')
        } else {
          errors.general = auth.state.error || 'Login failed. Please try again.'
        }
      } catch (error) {
        errors.general = 'An unexpected error occurred. Please try again.'
        console.error('Login error:', error)
      }
    }

    return {
      form,
      errors,
      loading,
      handleSubmit
    }
  }
}
</script>