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
      <div class="alert alert-danger" v-if="errors.general">
        {{ errors.general }}
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
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