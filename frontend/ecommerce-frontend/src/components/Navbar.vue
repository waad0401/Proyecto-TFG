<template>
  <nav class="navbar navbar-light bg-light shadow-sm fixed-top">
    <div class="container">
      <!-- Logo -->
      <RouterLink class="navbar-brand fw-bold" to="/">Delichoc 3D</RouterLink>

      <!-- Carrito -->
      <RouterLink to="/cart" class="btn position-relative me-2">
        <i class="bi bi-cart3 fs-4"></i>
        <span
          v-if="itemCount"
          class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill">
          {{ itemCount }}
        </span>
      </RouterLink>

      <!-- Hamburguesa -->
      <button
        class="navbar-toggler border-0"
        data-bs-toggle="offcanvas"
        data-bs-target="#offMenu">
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
        <RouterLink class="nav-link mb-2" :to="'/'"          @click="close">Inicio</RouterLink>
        <RouterLink class="nav-link mb-2" :to="'/about'"      @click="close">Quiénes somos</RouterLink>
        <RouterLink class="nav-link mb-2" :to="'/orders'"     @click="close">Mis pedidos</RouterLink>

        <RouterLink
          v-if="!auth.isAuthenticated"
          class="nav-link"
          :to="'/auth/login'"
          @click="close">
          Entrar
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
import { computed } from 'vue';
import { Offcanvas } from 'bootstrap';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

const cart = useCartStore();
const auth = useAuthStore();

const itemCount = computed(() => cart.totalItems);

function close () {
  Offcanvas.getOrCreateInstance('#offMenu').hide();
}
function logout () {
  auth.logout();
  close();
}
</script>
