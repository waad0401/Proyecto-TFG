<template>
  <!-- Barra superior fija -->
  <nav class="navbar navbar-light bg-light shadow-sm fixed-top">
    <div class="container">
      <!-- Marca -->
      <RouterLink class="navbar-brand fw-bold" to="/">Delichoc 3D</RouterLink>

      <!-- Icono carrito -->
      <RouterLink to="/cart" class="btn position-relative me-2">
        <i class="bi bi-cart3 fs-4"></i>
        <span
          v-if="itemCount"
          class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
          {{ itemCount }}
        </span>
      </RouterLink>

      <!-- Botón hamburguesa -->
      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offMenu"
        aria-controls="offMenu">
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- Menú lateral -->
    <div id="offMenu" class="offcanvas offcanvas-end" tabindex="-1">
      <div class="offcanvas-header">
        <h5 class="mb-0">Menú</h5>
        <button class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>

      <div class="offcanvas-body">
        <RouterLink class="nav-link mb-2" @click="close" to="/">Inicio</RouterLink>
        <RouterLink class="nav-link mb-2" @click="close" to="/about">Quiénes somos</RouterLink>
        <RouterLink class="nav-link mb-2" @click="close" to="/orders">Mis pedidos</RouterLink>

        <!-- Acciones de autenticación -->
        <RouterLink
          v-if="!auth.isAuthenticated"
          class="nav-link mb-2"
          @click="close"
          to="/auth/login">
          Entrar
        </RouterLink>

        <RouterLink
          v-if="!auth.isAuthenticated"
          class="nav-link"
          @click="close"
          to="/auth/register">
          Crear cuenta
        </RouterLink>

        <button
          v-else
          class="btn btn-outline-secondary w-100 mt-2"
          @click="logout">
          Salir
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed }   from 'vue';
import { Offcanvas }  from 'bootstrap';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

/* Pinia stores */
const cart = useCartStore();
const auth = useAuthStore();

/* Badge con nº de artículos */
const itemCount = computed(() => cart.totalItems);

/* Cerrar off-canvas programáticamente */
function close () {
  Offcanvas.getOrCreateInstance('#offMenu').hide();
}

/* Cerrar sesión y menú */
function logout () {
  auth.logout();
  close();
}
</script>

<style scoped>
/* puedes ajustar colores o tamaño del badge aquí si lo deseas */
</style>
