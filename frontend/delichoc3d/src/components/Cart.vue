<template>
  <section class="container py-5">
    <h2 class="mb-4">Mi carrito</h2>

    <!-- Tabla de líneas -->
    <table v-if="items.length" class="table align-middle">
      <thead>
        <tr>
          <th>Producto</th>
          <th class="text-center">Cant.</th>
          <th class="text-end">Subtotal</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in items" :key="i.productoId">
          <td>{{ i.nombre }}</td>
          <td class="text-center">{{ i.cantidad }}</td>
          <td class="text-end">{{ (i.cantidad * i.precio).toFixed(2) }} €</td>
          <td class="text-end">
            <button class="btn btn-sm btn-danger" @click="remove(i.productoId)">
              ×
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Carrito vacío -->
    <p v-else class="lead">El carrito está vacío.</p>

    <!-- Total + botón pagar -->
    <div class="text-end" v-if="items.length">
      <h4>Total: {{ totalPrecio.toFixed(2) }} €</h4>
      <RouterLink class="btn btn-success" to="/checkout">Ir a pagar</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '@/store/cart';

const cart = useCartStore();
const { items, totalPrecio } = storeToRefs(cart);

function remove (productoId) {
  cart.remove(productoId);
}
</script>
