<template>
  <section class="container py-5">
    <h2 class="mb-4">Mi carrito</h2>

    <table v-if="items.length" class="table align-middle">
      <thead>
        <tr><th>Producto</th><th>Cant.</th><th>Precio</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="i in items" :key="i.id">
          <td>{{ i.name }}</td>
          <td>{{ i.qty }}</td>
          <td>{{ (i.qty * i.price).toFixed(2) }} €</td>
          <td><button class="btn btn-sm btn-danger" @click="remove(i.id)">×</button></td>
        </tr>
      </tbody>
    </table>

    <p v-else class="lead">El carrito está vacío.</p>

    <div class="text-end" v-if="items.length">
      <h4>Total: {{ totalPrice.toFixed(2) }} €</h4>
      <RouterLink class="btn btn-success" to="/checkout">Ir a pagar</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useCartStore } from '../store/cart';

const cart = useCartStore();
const { items, totalPrice } = storeToRefs(cart);

function remove (id) { cart.remove(id); }
</script>
