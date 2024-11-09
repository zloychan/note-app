<template>
  <div>
    <div v-if="loading" data-test="loading-spinner" class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-else-if="error" data-test="error-message" class="alert alert-danger">
      {{ error }}
    </div>
    <slot v-else></slot>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'ProtectedRoute',
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const loading = ref(true)
    const error = ref(null)

    const checkAuthentication = async () => {
      try {
        const isAuthenticated = await auth.checkAuth()
        if (!isAuthenticated) {
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath }
          })
        }
      } catch (err) {
        error.value = 'Authentication error'
      } finally {
        loading.value = false
      }
    }

    onMounted(checkAuthentication)

    return {
      loading,
      error
    }
  }
})
</script>
