<template>
  <section class="container py-5">
    <h2 class="mb-4">Mis pedidos</h2>

    <!-- Tabla de pedidos -->
    <table v-if="pedidos.length" class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in pedidos" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ new Date(p.fecha).toLocaleDateString() }}</td>
          <td>{{ (+p.total).toFixed(2) }} €</td>
          <td>{{ p.estado }}</td>
        </tr>
      </tbody>
    </table>

    <p v-else class="lead">Todavía no tienes pedidos.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const pedidos = ref([]);

onMounted(async () => {
  const { data } = await api.get('/orders');   // devuelve { id, fecha, total, estado }
  pedidos.value = data;
});
</script>
