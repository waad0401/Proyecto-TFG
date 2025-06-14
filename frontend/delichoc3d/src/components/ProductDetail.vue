<template>
  <section class="container py-5">
    <div class="row">
      <!-- Imagen -->
      <div class="col-md-6" data-aos="fade-right">
        <img
          :src="`${config.imageBaseUrl}/${producto.imagen}`"
          :alt="producto.nombre"
          class="img-fluid rounded shadow-sm" />

        <button class="btn btn-link mt-3" @click="$router.push('/')">
          ← Volver al inicio
        </button>
        <button
          class="btn btn-outline-secondary mt-3 ms-2"
          @click="$router.push('/cart')">
          Ir al carrito
        </button>
      </div>

      <!-- Info -->
      <div class="col-md-6" data-aos="fade-left">
        <h2>{{ producto.nombre }}</h2>
        <p class="lead">{{ producto.descripcion }}</p>

        <h3 class="fw-bold">{{ (+producto.precio).toFixed(2) }} €</h3>

        <p>
          <span class="badge" :class="producto.stock ? 'bg-success' : 'bg-danger'">
            {{ producto.stock ? 'En stock' : 'Sin stock' }}
          </span>
        </p>

        <button
          class="btn"
          :class="producto.stock ? 'btn-primary' : 'btn-secondary disabled'"
          @click="tryAdd">
          {{ producto.stock ? 'Añadir al carrito' : 'Sin stock' }}
        </button>
      </div>
    </div>

    <!-- Comentarios -->
    <hr />
    <h4>Comentarios</h4>
    <ul class="list-group mb-3">
      <li v-for="c in comentarios" :key="c.id" class="list-group-item">
        <strong>{{ c.usuario }}:</strong> {{ c.contenido }}
        <small class="text-muted float-end">
          {{ new Date(c.creado_en).toLocaleString() }}
        </small>
      </li>
      <li v-if="!comentarios.length" class="list-group-item">
        Sé el primero en comentar
      </li>
    </ul>

    <div v-if="auth.isAuthenticated">
      <textarea
        v-model="nuevoComentario"
        class="form-control mb-2"
        placeholder="Escribe tu opinión…" />
      <button class="btn btn-success" @click="enviarComentario">Enviar</button>
    </div>
    <div v-else class="alert alert-info">
      Debes <RouterLink to="/auth/login">iniciar sesión</RouterLink> para comentar.
    </div>

    <!-- Otros productos -->
    <hr />
    <h4>Otros clientes también compraron</h4>
    <div class="row g-3">
      <div
        v-for="p in relacionados"
        :key="p.id"
        class="col-6 col-md-3"
        style="cursor:pointer"
        @click="$router.push(`/products/${p.id}`)">
        <img
          :src="`${config.imageBaseUrl}/${p.imagen}`"
          class="img-fluid rounded shadow-sm" />
        <p class="small text-center mt-1">{{ p.nombre }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import api, { config } from '@/services/api';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

const route           = useRoute();
const cart            = useCartStore();
const auth            = useAuthStore();

const producto        = ref({});
const comentarios     = ref([]);
const relacionados    = ref([]);
const nuevoComentario = ref('');

async function cargar(id = route.params.id) {
  const [{ data: prod }, { data: comm }, { data: rel }] = await Promise.all([
    api.get(`/products/${id}`),
    api.get(`/products/${id}/comments`),
    api.get('/products?featured=true')
  ]);

  producto.value     = prod;
  comentarios.value  = comm;
  relacionados.value = rel.filter(p => p.id !== prod.id).slice(0, 4);
}

async function tryAdd() {
  const ok = await cart.add(producto.value, 1);   // bloqueo invitado
  if (!ok) return;
}

async function enviarComentario() {
  if (!nuevoComentario.value.trim()) return;
  await api.post(`/products/${producto.value.id}/comments`, {
    contenido: nuevoComentario.value
  });
  nuevoComentario.value = '';
  await cargar(producto.value.id);                // refrescar lista
}

onMounted(cargar);
watch(() => route.params.id, cargar);
</script>
