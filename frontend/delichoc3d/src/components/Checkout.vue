<template>
  <section class="container py-5" style="max-width:480px">
    <h2 class="mb-4 text-center">Confirmar pedido</h2>

    <!-- Mensaje de éxito -->
    <div v-if="exito" class="alert alert-success">
      <h5 class="mb-2">¡Pedido registrado!</h5>
      <p class="mb-1">
        Prueba de pedido<br/>
        Concepto: <em>Delichoc3D – Pedido #{{ pedidoId }}</em>
      </p>
      <p class="mb-0">También aceptamos <strong>Bizum 666 555 444</strong>.</p>
      <RouterLink class="btn btn-link mt-3 p-0" to="/">Volver a la tienda</RouterLink>
    </div>

    <!-- Botón de confirmación -->
    <div v-else>
      <p class="lead">
        Total a pagar:
        <strong>{{ totalPrecio.toFixed(2) }} €</strong>
      </p>
      <button
        class="btn btn-primary w-100"
        :disabled="cargando || !cart.items.length"
        @click="pagar"
      >
        {{ cargando ? 'Guardando…' : 'Confirmar pedido' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useCartStore } from '@/store/cart';

const router       = useRouter();
const cart         = useCartStore();
const totalPrecio  = cart.totalPrecio;               // getter reactivo

const cargando     = ref(false);
const exito        = ref(false);
const pedidoId     = ref(null);

async function pagar () {
  if (!cart.items.length) return;

  cargando.value = true;

  try {
    /* Prepara items para la API */
    const items = cart.items.map(i => ({
      productoId : i.productoId,
      cantidad   : i.cantidad,
      precio     : i.precio
    }));

    /* Crea pedido con estado 'pendiente' */
    const { data } = await api.post('/orders', { items, total: totalPrecio });
    pedidoId.value = data.pedidoId;

    await cart.clear();        // vacía carrito
    exito.value = true;        // muestra mensaje
  } catch (e) {
    alert('Error al crear el pedido');
    console.error(e);
  } finally {
    cargando.value = false;
  }
}
</script>
