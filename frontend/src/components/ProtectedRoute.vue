<template>
  <div>
    <template v-if="loading">
      <div data-test="loading-spinner" class="d-flex justify-content-center align-items-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </template>
    <template v-else-if="error">
      <div data-test="error-message" class="alert alert-danger" role="alert">
        {{ error }}
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  name: 'ProtectedRoute',
  
  setup() {
    const router = useRouter()
    const auth = useAuthStore()
    const loading = ref(true)
    const error = ref<string | null>(null)

    const checkAuth = async () => {
      try {
        loading.value = true
        const isAuthenticated = await auth.checkAuth()
        if (!isAuthenticated) {
          await router.push({
            path: '/login',
            query: { redirect: router.currentRoute.value.fullPath }
          })
        }
      } catch (err) {
        error.value = 'Authentication error occurred. Please try logging in again.'
        console.error('Protected route auth check failed:', err)
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      checkAuth()
    })

    return {
      loading,
      error
    }
  }
})
</script>
