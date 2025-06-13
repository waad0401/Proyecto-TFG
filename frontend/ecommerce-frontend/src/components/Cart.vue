<template>
  <div class="container py-4">
    <h1 class="h3 mb-4">Carrito</h1>

    <div v-if="!items.length" class="alert alert-warning">
      Tu carrito está vacío
    </div>

    <div v-else>
      <table class="table table-striped align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in items" :key="i.id">
            <td>{{ i.name }}</td>
            <td><span class="badge bg-secondary">{{ i.qty }}</span></td>
            <td>{{ (i.price * i.qty).toFixed(2) }} €</td>
            <td>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="remove(i.id)"
              >
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="alert alert-info text-end">
        <strong>Total: {{ total.toFixed(2) }} €</strong>
      </div>

      <RouterLink class="btn btn-success" to="/checkout">
        Proceder al pago
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../store/cart';
const cart = useCartStore();
const items = computed(() => cart.items);
const total = computed(() => cart.total);
function remove(id) {
  cart.remove(id);
}
</script>
