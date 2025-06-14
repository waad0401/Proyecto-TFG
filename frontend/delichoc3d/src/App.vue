<template>
  <!-- Barra de navegación fija -->
  <Navbar />

  <!-- Contenido de cada página -->
  <main class="pt-5">
    <router-view :key="$route.fullPath" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style>
/* Ajusta altura total y margen por la navbar fija */
html, body, #app {
  height: 100%;
}
main {
  margin-top: 4rem; /* altura aprox. de la navbar */
}

/* Transición suave entre páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
