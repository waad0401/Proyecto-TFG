<template>
  <section class="container py-5">
    <h2 class="mb-4">Mis pedidos</h2>

    <table v-if="orders.length" class="table">
      <thead><tr><th>#</th><th>Fecha</th><th>Total</th><th>Estado</th></tr></thead>
      <tbody>
        <tr v-for="o in orders" :key="o.id">
          <td>{{ o.id }}</td>
          <td>{{ new Date(o.date).toLocaleDateString() }}</td>
          <td>{{ o.total.toFixed(2) }} €</td>
          <td>{{ o.status }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="lead">Todavía no tienes pedidos.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);

onMounted(async () => {
  const { data } = await api.get('/orders');
  orders.value = data;
});
</script>
