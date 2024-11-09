<template>
  <div class="login">
    <h2>Login</h2>
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
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
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

      loading.value = true
      try {
        // API call will be implemented later
        console.log('Form submitted:', form)
        await new Promise(resolve => setTimeout(resolve, 100)) // Simulate API call
        localStorage.setItem('token', 'dummy-token')
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