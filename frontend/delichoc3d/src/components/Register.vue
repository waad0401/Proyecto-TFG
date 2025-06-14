<template>
  <section class="container py-5" style="max-width:480px">
    <h2 class="mb-4 text-center">Crear cuenta</h2>

    <form novalidate @submit.prevent="submit">
      <!-- Nombre -->
      <div class="mb-3">
        <label class="form-label" for="nombre">Nombre</label>
        <input id="nombre" v-model.trim="nombre" class="form-control" minlength="2" required />
        <small v-if="msg('nombre')" class="text-danger">{{ msg('nombre') }}</small>
      </div>

      <!-- Correo -->
      <div class="mb-3">
        <label class="form-label" for="correo">Correo electrónico</label>
        <input id="correo" v-model.trim="correo" type="email" class="form-control" require />
        <small v-if="msg('correo')" class="text-danger">{{ msg('correo') }}</small>
      </div>

      <!-- Contraseña -->
      <div class="mb-4">
        <label class="form-label" for="contrasena">Contraseña</label>
        <input id="contrasena" v-model="contrasena" type="password" class="form-control" minlength="8" required />
        <small v-if="msg('contrasena')" class="text-danger">
          {{ msg('contrasena') }}
        </small>
      </div>

      <button class="btn btn-success w-100" :disabled="cargando">
        {{ cargando ? 'Creando…' : 'Registrarse' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import api from '@/services/api';

const router     = useRouter();
const auth       = useAuthStore();

/* ---- modelo de datos ---- */
const nombre      = ref('');
const correo      = ref('');
const contrasena  = ref('');

/* ---- estado de UI ---- */
const cargando    = ref(false);
const errores     = ref({});                 // { campo: mensaje }

function msg (campo) {
  return errores.value[campo];
}

async function submit () {
  cargando.value = true;
  errores.value  = {};

  try {
    /* petición al backend */
    await api.post('/auth/register', {
      nombre: nombre.value,
      correo: correo.value,
      contrasena: contrasena.value
    });

    /* login automático y redirección */
    await auth.login(correo.value, contrasena.value);
    router.replace('/');
  } catch (e) {
    /* 422 → muestra errores de validación */
    if (e.response?.status === 422) {
      e.response.data.errores.forEach(err => {
        errores.value[err.path] = err.msg;       // path ← express-validator
      });
    } else {
      alert('Error inesperado al registrar');
      console.error(e);
    }
  } finally {
    cargando.value = false;
  }
}
</script>
