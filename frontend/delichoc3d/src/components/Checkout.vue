<template>
  <section class="container py-5">
    <h2 class="mb-4">Pago</h2>

    <div v-if="!success">
      <p class="lead">Total a pagar: <strong>{{ total.toFixed(2) }} €</strong></p>
      <button class="btn btn-primary" @click="pay" :disabled="loading">
        {{ loading ? 'Procesando…' : 'Confirmar pedido' }}
      </button>
    </div>

    <div v-else class="alert alert-success">
      ¡Pedido realizado con éxito! <RouterLink to="/">Volver a la tienda</RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import api from '@/services/api';
import { useCartStore } from '@/store/cart';

const cart   = useCartStore();
const total  = cart.totalPrice;
const loading = ref(false);
const success = ref(false);

async function pay () {
  loading.value = true;
  await api.post('/checkout');
  await cart.clear();
  success.value = true;
  loading.value = false;
}
</script>
