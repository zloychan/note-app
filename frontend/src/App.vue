<template>
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">Notes App</RouterLink>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" active-class="active" to="/register">Register</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <main class="container mt-4">
      <RouterView />
    </main>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'

export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView
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
</style>
