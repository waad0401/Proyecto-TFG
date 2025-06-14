<template>
  <section class="container py-5" style="max-width:480px">
    <h2 class="mb-4 text-center">Iniciar sesión</h2>

    <form @submit.prevent="submit">
      <!-- Correo -->
      <div class="mb-3">
        <label class="form-label">Correo electrónico</label>
        <input v-model="correo" type="email" class="form-control" />
        <small v-if="msg('correo')" class="text-danger">{{ msg('correo') }}</small>
      </div>

      <!-- Contraseña -->
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input v-model="contrasena" type="password" class="form-control" />
        <small v-if="msg('contrasena')" class="text-danger">{{ msg('contrasena') }}</small>
      </div>

      <button class="btn btn-primary w-100" :disabled="cargando">
        {{ cargando ? 'Entrando…' : 'Entrar' }}
      </button>
    </form>

    <RouterLink to="/auth/register" class="d-block mt-3 text-center">
      Crear cuenta
    </RouterLink>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';

const router      = useRouter();
const route       = useRoute();
const auth        = useAuthStore();

const correo      = ref('');
const contrasena  = ref('');
const cargando    = ref(false);
const errores     = ref({});              // { campo: mensaje }

function msg (campo) { return errores.value[campo]; }

async function submit () {
  cargando.value = true;
  errores.value  = {};

  try {
    // intento de login
    await auth.login(correo.value, contrasena.value);

    // redirección post-login
    const destino = route.query.redirect || '/';
    router.replace(destino);
  } catch (e) {
    // errores de validación: { errores: [{ path, msg }] }
    if (e.response?.status === 422) {
      e.response.data.errores.forEach(err => { errores.value[err.path] = err.msg; });
    } else {
      alert('Credenciales incorrectas');
    }
  } finally {
    cargando.value = false;
  }
}
</script>
