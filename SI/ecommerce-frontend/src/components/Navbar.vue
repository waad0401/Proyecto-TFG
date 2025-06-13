<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-3">
    <div class="container-fluid">
      <RouterLink class="navbar-brand fw-bold" to="/">Shop</RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="nav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <!-- NO autenticado -->
          <template v-if="!auth.isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/register">Registro</RouterLink>
            </li>
          </template>

          <!-- SÍ autenticado -->
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/orders">Mis pedidos</RouterLink>
            </li>
            <li class="nav-item">
              <button class="btn btn-outline-danger ms-lg-3" @click="auth.logout">
                Salir
              </button>
            </li>
          </template>

          <!-- Carrito siempre visible -->
          <li class="nav-item ms-lg-3">
            <RouterLink class="nav-link" to="/cart">
              Carrito <span class="badge bg-secondary">{{ cart.items.length }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
const auth = useAuthStore();
const cart = useCartStore();
</script>
