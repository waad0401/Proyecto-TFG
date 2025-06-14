<template>
  <section class="container py-5" style="max-width:480px">
    <h2 class="mb-4 text-center">Iniciar sesión</h2>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control" required>
      </div>
      <button class="btn btn-primary w-100" :disabled="loading">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <RouterLink to="/register" class="d-block mt-3 text-center">Crear cuenta</RouterLink>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter, useRoute } from 'vue-router';

const email    = ref('');
const password = ref('');
const loading  = ref(false);

const auth  = useAuthStore();
const router = useRouter();
const route  = useRoute();

async function submit () {
  loading.value = true;
  await auth.login(email.value, password.value);
  const redirect = route.query.redirect || '/';
  router.replace(redirect);
}
</script>
