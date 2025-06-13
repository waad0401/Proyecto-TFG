<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="h3 mb-4 text-center">Checkout</h1>

        <form @submit.prevent="submit">
          <div class="mb-3">
            <label class="form-label">Dirección de envío</label>
            <input
              v-model="address"
              type="text"
              class="form-control"
              required
            />
          </div>

          <button class="btn btn-primary w-100">Confirmar pedido</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cart';
import { useOrderStore } from '../store/order';

const address = ref('');
const cart = useCartStore();
const orderStore = useOrderStore();
const router = useRouter();

async function submit() {
  await orderStore.checkout(cart);
  cart.clear();
  router.push('/orders');
}
</script>
