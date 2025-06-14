<template>
  <div id="carouselProducts" class="carousel slide mb-5" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div v-for="(p,i) in products" :key="p.id" :class="['carousel-item', {active:i===0}]" data-aos="fade-up">
        <img :src="`${config.imageBaseUrl}/${p.image}`" class="d-block w-100" style="max-height:480px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
          <h5>{{ p.name }}</h5><p>{{ p.description }}</p>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#carouselProducts" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#carouselProducts" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api, { config } from '../services/api';

const products = ref([]);
onMounted(async () => {
  const { data } = await api.get('/products?featured=true');
  products.value = data;
});
</script>
