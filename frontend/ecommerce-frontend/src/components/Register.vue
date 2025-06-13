<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="card shadow-sm" style="max-width: 420px; width: 100%">
      <div class="card-body">
        <h1 class="h4 mb-4 text-center">Registro</h1>

        <form @submit.prevent="register">
          <div class="mb-3">
            <label class="form-label">Nombre</label>
            <input v-model="name" type="text" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="email" type="email" class="form-control" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Password</label>
            <input
              v-model="password"
              type="password"
              class="form-control"
              required
            />
          </div>

          <button class="btn btn-success w-100">Crear cuenta</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';

const name = ref('');
const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();

async function register() {
  await auth.register({
    name: name.value,
    email: email.value,
    password: password.value
  });
  await auth.login({ email: email.value, password: password.value });
  router.push('/');
}
</script>
