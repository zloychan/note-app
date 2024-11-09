<template>
  <div class="register">
    <h2>Register</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input 
          type="email" 
          v-model="form.email"
          :class="{ 'is-invalid': errors.email }"
          required
        >
        <div class="invalid-feedback" v-if="errors.email">
          {{ errors.email }}
        </div>
      </div>
      <div class="form-group">
        <input 
          type="password"
          id="password"
          v-model="form.password"
          :class="{ 'is-invalid': errors.password }"
          required
        >
        <div class="invalid-feedback" v-if="errors.password">
          {{ errors.password }}
        </div>
      </div>
      <div class="form-group">
        <input 
          type="password"
          id="confirmPassword"
          v-model="form.confirmPassword"
          :class="{ 'is-invalid': errors.confirmPassword }"
          required
        >
        <div class="invalid-feedback" v-if="errors.confirmPassword">
          {{ errors.confirmPassword }}
        </div>
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',
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
      Object.keys(errors).forEach(key => errors[key] = '')

      if (!form.email) {
        errors.email = 'Email is required'
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!form.password) {
        errors.password = 'Password is required'
        isValid = false
      } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters'
        isValid = false
      }

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
        await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API call
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