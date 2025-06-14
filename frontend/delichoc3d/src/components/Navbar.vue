<template>
  <nav class="navbar navbar-light bg-light shadow-sm fixed-top">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/">Delichoc 3D</RouterLink>

      <RouterLink to="/cart" class="btn position-relative me-2">
        <i class="bi bi-cart3 fs-4"></i>
        <span v-if="items" class="badge bg-danger position-absolute top-0 start-100 translate-middle">
          {{ items }}
        </span>
      </RouterLink>

      <button class="navbar-toggler border-0"
              data-bs-toggle="offcanvas"
              data-bs-target="#offMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Offcanvas -->
    <div id="offMenu" class="offcanvas offcanvas-end" tabindex="-1">
      <div class="offcanvas-header">
        <h5 class="mb-0">Menú</h5>
        <button class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <RouterLink class="nav-link mb-2" @click="close" to="/">Inicio</RouterLink>
        <RouterLink class="nav-link mb-2" @click="close" to="/about">Quiénes somos</RouterLink>
        <RouterLink class="nav-link mb-2" @click="close" to="/orders">Mis pedidos</RouterLink>
        <RouterLink class="nav-link"       @click="close" to="/login">Entrar</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { Offcanvas } from 'bootstrap';          // JS modular :contentReference[oaicite:6]{index=6}
import { useCartStore } from '../store/cart';

const items = computed(() => useCartStore().totalItems);
function close () { Offcanvas.getOrCreateInstance('#offMenu').hide(); }
</script>
