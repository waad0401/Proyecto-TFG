<template>
  <section class="container py-5" style="max-width:480px">
    <h2 class="mb-4 text-center">Crear cuenta</h2>

    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Nombre</label>
        <input v-model="name" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input v-model="password" type="password" class="form-control" required>
      </div>

      <button class="btn btn-success w-100" :disabled="loading">
        {{ loading ? 'Creando…' : 'Registrarse' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const name     = ref('');
const email    = ref('');
const password = ref('');
const loading  = ref(false);

const auth  = useAuthStore();
const router = useRouter();

async function submit () {
  loading.value = true;
  await auth.register({ name: name.value, email: email.value, password: password.value });
  router.replace('/');
}
</script>
