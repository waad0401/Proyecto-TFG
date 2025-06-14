<template>
  <header class="bg-light py-5 text-center" data-aos="fade-down">
    <h1 class="display-4 fw-bold">Delichoc 3D</h1>
    <p class="lead">Dulces impresos en 3D: sabor y creatividad sin límites</p>
  </header>

  <ProductCarousel />

  <section class="container">
    <h2 class="my-4 text-center" data-aos="zoom-in">Todos nuestros productos</h2>
    <ProductList />
  </section>
</template>

<script setup>
import ProductCarousel from '@/components/ProductCarousel.vue';
import ProductList     from '@/components/ProductList.vue';
</script>
