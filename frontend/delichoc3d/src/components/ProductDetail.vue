<template>
  <section class="container py-5">
    <div class="row">
      <div class="col-md-6" data-aos="fade-right">
        <img :src="`${config.imageBaseUrl}/${product.image}`" class="img-fluid rounded shadow"/>
      </div>

      <div class="col-md-6" data-aos="fade-left">
        <h2>{{ product.name }}</h2>
        <p class="lead">{{ product.description }}</p>
        <h3 class="fw-bold">{{ product.price?.toFixed(2) }} €</h3>

        <button class="btn btn-primary mt-3"
                @click="cart.add(product)">
          Añadir al carrito
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api, { config } from '@/services/api';
import { useCartStore } from '@/store/cart';

const product = ref({});
const cart    = useCartStore();
const route   = useRoute();

onMounted(async () => {
  const { data } = await api.get(`/products/${route.params.id}`);
  product.value = data;
});
</script>
