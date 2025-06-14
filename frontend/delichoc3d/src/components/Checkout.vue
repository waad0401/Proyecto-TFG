<template>
  <section class="container py-5">
    <h2 class="mb-4">Pago</h2>

    <!-- Pantalla de confirmación -->
    <div v-if="exito" class="alert alert-success">
      ¡Pedido realizado con éxito!
      <RouterLink to="/">Volver a la tienda</RouterLink>
    </div>

    <!-- Botón de pago -->
    <div v-else>
      <p class="lead">
        Total a pagar:
        <strong>{{ totalPrecio.toFixed(2) }} €</strong>
      </p>
      <button class="btn btn-primary" @click="pagar" :disabled="cargando">
        {{ cargando ? 'Procesando…' : 'Confirmar pedido' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useCartStore } from '@/store/cart';

const cart        = useCartStore();
const totalPrecio = cart.totalPrecio;              // getter ya en español
const cargando    = ref(false);
const exito       = ref(false);
const router      = useRouter();

async function pagar () {
  if (!cart.items.length) return;                  // evita pedido vacío

  cargando.value = true;

  try {
    /* preparamos payload: [{ productoId, cantidad, precio }] */
    const items = cart.items.map(i => ({
      productoId : i.productoId,
      cantidad   : i.cantidad,
      precio     : i.precio
    }));

    await api.post('/orders', { items, total: totalPrecio });
    await cart.clear();
    exito.value = true;
  } catch (e) {
    alert('Error al procesar el pedido');
    console.error(e);
  } finally {
    cargando.value = false;
  }
}
</script>
