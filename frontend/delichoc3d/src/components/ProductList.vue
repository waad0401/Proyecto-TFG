<template>
  <div class="row g-4">
    <div v-for="p in products" :key="p.id" class="col-sm-6 col-md-4 col-lg-3" data-aos="fade-up">
      <RouterLink :to="`/products/${p.id}`" class="text-decoration-none text-dark">
        <div class="card h-100 shadow-sm">
          <img :src="`${config.imageBaseUrl}/${p.image}`" class="card-img-top" />
          <div class="card-body">
            <h6 class="card-title">{{ p.name }}</h6>
            <p class="card-text fw-bold">{{ p.price.toFixed(2) }} €</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { config } from '@/services/api';

const products = ref([]);
onMounted(async () => {
  const { data } = await api.get('/products');
  products.value = data;
});
</script>
