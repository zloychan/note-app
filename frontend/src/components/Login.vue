<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card card-custom">
            <div class="card-body">
              <h2 class="text-center mb-4">Login</h2>
              <form @submit.prevent="handleSubmit">
                <div class="mb-3">
                  <label for="email" class="form-label">Email address</label>
                  <input
                    type="email"
                    class="form-control form-control-custom"
                    id="email"
                    v-model="form.email"
                    :class="{ 'is-invalid': errors.email }"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.email">
                    {{ errors.email }}
                  </div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control form-control-custom"
                    id="password"
                    v-model="form.password"
                    :class="{ 'is-invalid': errors.password }"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.password">
                    {{ errors.password }}
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </form>
              <div class="text-center mt-3">
                Don't have an account? 
                <router-link to="/register">Register here</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'Login',
    setup() {
      const router = useRouter()
      const loading = ref(false)
      const form = reactive({
        email: '',
        password: ''
      })
      const errors = reactive({
        email: '',
        password: ''
      })
  
      const validateForm = () => {
        let isValid = true
        // Reset errors
        Object.keys(errors).forEach(key => errors[key] = '')
  
        // Email validation
        if (!form.email) {
          errors.email = 'Email is required'
          isValid = false
        }
  
        // Password validation
        if (!form.password) {
          errors.password = 'Password is required'
          isValid = false
        }
  
        return isValid
      }
  
      const handleSubmit = async () => {
        if (!validateForm()) return
  
        loading.value = true
        try {
          // API call will be implemented later
          console.log('Form submitted:', form)
          localStorage.setItem('token', 'dummy-token') // Temporary for testing
          router.push('/notes')
        } catch (error) {
          console.error('Login error:', error)
        } finally {
          loading.value = false
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