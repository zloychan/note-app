<template>
    <div class="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <router-link to="/" class="btn btn-primary">Go Home</router-link>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundView'
  }
  </script>