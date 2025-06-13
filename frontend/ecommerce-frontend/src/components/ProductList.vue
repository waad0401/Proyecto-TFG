<template>
  <div class="container py-4">
    <div class="row g-4">
      <div v-for="p in products" :key="p.id" class="col-12 col-md-4">
        <div class="card h-100">
          <img :src="`${config.imageBaseUrl}/${p.image}`" class="card-img-top" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">{{ p.name }}</h5>
            <p class="card-text flex-grow-1">{{ p.description }}</p>
            <p class="fw-bold">{{ p.price.toFixed(2) }} €</p>
            <RouterLink
              :to="`/products/${p.id}`"
              class="btn btn-primary mt-auto"
            >
              Ver detalle
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { config } from '../services/api';
const products = ref([]);
onMounted(async () => {
  const { data } = await api.get('/products');
  products.value = data;
});
</script>
