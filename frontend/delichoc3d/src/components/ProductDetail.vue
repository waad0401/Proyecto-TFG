<template>
  <section class="container py-5">
    <div class="row">
      <!-- Imagen -->
      <div class="col-md-6" data-aos="fade-right">
        <img :src="`${config.imageBaseUrl}/${product.image}`"
             class="img-fluid rounded shadow-sm" :alt="product.name" />
        <button class="btn btn-link mt-3" @click="$router.push('/')">
          ← Volver al inicio
        </button>
        <button class="btn btn-outline-secondary mt-3 ms-2"
                @click="$router.push('/cart')">
          Ir al carrito
        </button>
      </div>

      <!-- Info -->
      <div class="col-md-6" data-aos="fade-left">
        <h2>{{ product.name }}</h2>
        <p class="lead">{{ product.description }}</p>

        <h3 class="fw-bold">{{ (+product.price).toFixed(2) }} €</h3>

        <p>
          <span class="badge" :class="product.stock ? 'bg-success':'bg-danger'">
            {{ product.stock ? 'En stock':'Sin stock' }}
          </span>
        </p>

        <button class="btn"
                :class="product.stock ? 'btn-primary':'btn-secondary disabled'"
                @click="tryAdd">
          {{ product.stock ? 'Añadir al carrito':'Sin stock' }}
        </button>
      </div>
    </div>

    <!-- Comentarios -->
    <hr />
    <h4>Comentarios</h4>
    <ul class="list-group mb-3">
      <li v-for="c in comments" :key="c.id" class="list-group-item">
        <strong>{{ c.user }}:</strong> {{ c.content }}
        <small class="text-muted float-end">
          {{ new Date(c.created_at).toLocaleString() }}
        </small>
      </li>
      <li v-if="!comments.length" class="list-group-item">
        Sé el primero en comentar
      </li>
    </ul>

    <div v-if="auth.isAuthenticated">
      <textarea v-model="newComment" class="form-control mb-2"
                placeholder="Escribe tu opinión…"/>
      <button class="btn btn-success" @click="submitComment">
        Enviar
      </button>
    </div>
    <div v-else class="alert alert-info">
      Debes <RouterLink to="/auth/login">iniciar sesión</RouterLink>
      para comentar.
    </div>

    <!-- Otros productos -->
    <hr />
    <h4>Otros clientes también compraron</h4>
    <div class="row g-3">
      <div v-for="p in related" :key="p.id" class="col-6 col-md-3"
           @click="$router.push(`/products/${p.id}`)" style="cursor:pointer">
        <img :src="`${config.imageBaseUrl}/${p.image}`"
             class="img-fluid rounded shadow-sm" />
        <p class="small text-center mt-1">{{ p.name }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import api, { config } from '@/services/api';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';

const route   = useRoute();
const router  = useRouter();
const cart    = useCartStore();
const auth    = useAuthStore();

const product   = ref({});
const comments  = ref([]);
const related   = ref([]);
const newComment = ref('');

async function load(id = route.params.id) {
  const [{ data: prod }, { data: comm }, { data: rel }] =
    await Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/comments`),
      api.get('/products?featured=true')
    ]);
  product.value  = prod;
  comments.value = comm;
  related.value  = rel.filter(p => p.id !== prod.id).slice(0,4);
}

async function tryAdd() {
  const res = await cart.add(product.value, 1); // auth check dentro del store
  if (!res) return; // se redirigió al login
}

async function submitComment() {
  if (!newComment.value.trim()) return;
  await api.post(`/products/${product.value.id}/comments`, { content: newComment.value });
  newComment.value = '';
  await load(product.value.id); // refresca lista
}

onMounted(load);
watch(() => route.params.id, load);
</script>
