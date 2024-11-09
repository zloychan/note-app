<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card card-custom">
            <div class="card-body">
              <h2 class="text-center mb-4">Register</h2>
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
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control form-control-custom"
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :class="{ 'is-invalid': errors.confirmPassword }"
                    required
                  >
                  <div class="invalid-feedback" v-if="errors.confirmPassword">
                    {{ errors.confirmPassword }}
                  </div>
                </div>
                <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                  {{ loading ? 'Registering...' : 'Register' }}
                </button>
              </form>
              <div class="text-center mt-3">
                Already have an account? 
                <router-link to="/login">Login here</router-link>
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
    name: 'Register',
    setup() {
      const router = useRouter()
      const loading = ref(false)
      const form = reactive({
        email: '',
        password: '',
        confirmPassword: ''
      })
      const errors = reactive({
        email: '',
        password: '',
        confirmPassword: ''
      })
  
      const validateForm = () => {
        let isValid = true
        // Reset errors
        Object.keys(errors).forEach(key => errors[key] = '')
  
        // Email validation
        if (!form.email) {
          errors.email = 'Email is required'
          isValid = false
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          errors.email = 'Please enter a valid email address'
          isValid = false
        }
  
        // Password validation
        if (!form.password) {
          errors.password = 'Password is required'
          isValid = false
        } else if (form.password.length < 8) {
          errors.password = 'Password must be at least 8 characters'
          isValid = false
        }
  
        // Confirm password validation
        if (form.password !== form.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match'
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
          router.push('/login')
        } catch (error) {
          console.error('Registration error:', error)
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