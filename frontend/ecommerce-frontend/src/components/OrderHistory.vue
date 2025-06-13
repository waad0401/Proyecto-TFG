<template>
  <div class="container py-4">
    <h1 class="h3 mb-4">Mis pedidos</h1>

    <div v-if="!orders.length" class="alert alert-info">
      No tienes pedidos aún
    </div>

    <div v-else class="row g-3">
      <div v-for="o in orders" :key="o.id" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Pedido #{{ o.id }}</h5>
            <p class="card-text mb-1">
              Fecha: {{ new Date(o.date).toLocaleDateString() }}
            </p>
            <p class="card-text fw-bold">
              Total: {{ o.total.toFixed(2) }} €
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useOrderStore } from '../store/order';
const orderStore = useOrderStore();
const orders = computed(() => orderStore.orders);
onMounted(orderStore.fetchOrders);
</script>
