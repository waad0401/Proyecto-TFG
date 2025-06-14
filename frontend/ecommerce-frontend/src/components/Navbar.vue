<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar navbar-light bg-light shadow-sm fixed-top">
    <div class="container align-items-center">

      <!-- Brand -->
      <RouterLink class="navbar-brand fw-bold" to="/">Delichoc 3D</RouterLink>

      <!-- Carrito -->
      <RouterLink to="/cart" class="btn position-relative me-2">
        <i class="bi bi-cart3 fs-4"></i>
        <span class="badge bg-danger position-absolute top-0 start-100 translate-middle px-2 rounded-pill">
          {{ items }}
        </span>
      </RouterLink>

      <!-- Botón hamburger -->
      <button class="navbar-toggler border-0"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
              aria-controls="offcanvasMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Offcanvas menu -->
    <div id="offcanvasMenu" class="offcanvas offcanvas-end"
         tabindex="-1" aria-labelledby="offcanvasLabel">
      <div class="offcanvas-header">
        <h5 id="offcanvasLabel" class="mb-0">Menú</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      <div class="offcanvas-body">
        <ul class="navbar-nav flex-column">
          <li class="nav-item" @click="close"><RouterLink class="nav-link" to="/">Inicio</RouterLink></li>
          <li class="nav-item" @click="close"><RouterLink class="nav-link" to="/about">Quiénes somos</RouterLink></li>
          <li class="nav-item" @click="close"><RouterLink class="nav-link" to="/orders">Mis pedidos</RouterLink></li>
          <li class="nav-item" @click="close"><RouterLink class="nav-link" to="/login">Iniciar sesión</RouterLink></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/store/cart';
import { Offcanvas } from 'bootstrap';

const { totalItems } = useCartStore();
const items = computed(() => totalItems);

function close () {
  // Cierra el offcanvas tras navegar
  const off = Offcanvas.getOrCreateInstance('#offcanvasMenu');
  off.hide();
}
</script>
