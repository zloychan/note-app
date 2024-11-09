<template>
  <div id="app">
    <NavBar />
    <main class="container mt-4">
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    NavBar
  }
}
</script>

<style>
#app {
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark-color);
}

.navbar {
  margin-bottom: var(--spacing-base);
}

.container {
  max-width: 1200px;
  padding: var(--spacing-base);
}

.route-enter-from,
.route-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.route-enter-active,
.route-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.route-enter-to,
.route-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
