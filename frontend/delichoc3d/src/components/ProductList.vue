<template>
  <div class="row g-4">
    <div
      v-for="p in productos"
      :key="p.id"
      class="col-sm-6 col-md-4 col-lg-3"
      data-aos="fade-up"
    >
      <RouterLink
        :to="`/products/${p.id}`"
        class="text-decoration-none text-dark"
      >
        <div class="card h-100 shadow-sm">
          <!-- imagen -->
          <img
            :src="`${config.imageBaseUrl}/${p.imagen}`"
            class="card-img-top"
            :alt="p.nombre"
            style="object-fit: cover; height: 220px"
          />

          <div class="card-body">
            <h6 class="card-title">{{ p.nombre }}</h6>
            <p class="card-text fw-bold">
              {{ (+p.precio).toFixed(2) }} €
            </p>

            <!-- botón Añadir / Sin stock -->
            <button
              class="btn btn-sm"
              :class="p.stock ? 'btn-primary' : 'btn-secondary disabled'"
              @click.stop="p.stock && cart.add(p)"
            >
              {{ p.stock ? 'Añadir' : 'Sin stock' }}
            </button>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import api, { config } from '@/services/api';
import { useCartStore } from '@/store/cart';

const cart      = useCartStore();
const productos = ref([]);

onMounted(async () => {
  const { data } = await api.get('/products');   // devuelve [{ id, nombre, precio… }]
  productos.value = data;
});
</script>
