<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <NavBar />
    <main class="container-fluid container-xxl flex-grow-1">
      <div class="row justify-content-center">
        <div class="col-12 col-md-11 col-lg-10 px-3 px-md-4">
          <router-view v-slot="{ Component }">
            <transition name="route" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
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
/* Base styles with mobile-first approach */
#app {
  font-family: var(--font-family-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark-color);
  font-size: calc(var(--font-size-base) * 0.9);
}

/* Responsive typography */
@media (min-width: 768px) {
  #app {
    font-size: var(--font-size-base);
  }
}

@media (min-width: 1200px) {
  #app {
    font-size: calc(var(--font-size-base) * 1.1);
  }
}

/* Container spacing */
.container-fluid {
  padding: calc(var(--spacing-base) * 0.75);
}

@media (min-width: 768px) {
  .container-fluid {
    padding: var(--spacing-base);
  }
}

@media (min-width: 1200px) {
  .container-fluid {
    padding: calc(var(--spacing-base) * 1.25);
  }
}

/* Route transitions */
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

/* Responsive spacing utilities */
.navbar {
  margin-bottom: calc(var(--spacing-base) * 0.75);
}

@media (min-width: 768px) {
  .navbar {
    margin-bottom: var(--spacing-base);
  }
}

/* Content max-width control */
.container-xxl {
  max-width: 1400px;
}
</style>
