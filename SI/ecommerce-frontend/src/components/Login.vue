<template>
  <div
    class="container d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="card shadow-sm" style="max-width: 420px; width: 100%">
      <div class="card-body">
        <h1 class="h4 mb-4 text-center">Login</h1>

        <form @submit.prevent="login">
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

          <button class="btn btn-primary w-100">Entrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter, useRoute } from 'vue-router';

const email = ref('');
const password = ref('');
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

async function login() {
  await auth.login({ email: email.value, password: password.value });
  router.push(route.query.redirect || '/');
}
</script>
