<template>
  <div v-if="product" class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <img
          :src="`${config.imageBaseUrl}/${product.image}`"
          class="img-fluid rounded shadow-sm mb-3"
        />
      </div>
      <div class="col-md-6">
        <h1 class="h3 mb-3">{{ product.name }}</h1>
        <p class="mb-3">{{ product.description }}</p>
        <p class="h4 fw-bold mb-4">{{ product.price.toFixed(2) }} €</p>
        <button class="btn btn-success" @click="addToCart">
          Añadir al carrito
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api, { config } from '../services/api';
import { useCartStore } from '../store/cart';

const product = ref(null);
const route = useRoute();
const cart = useCartStore();

onMounted(async () => {
  const { data } = await api.get(`/products/${route.params.id}`);
  product.value = data;
});

function addToCart() {
  cart.add({ ...product.value, qty: 1 });
}
</script>
