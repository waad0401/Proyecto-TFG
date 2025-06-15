import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  { path: '/',             component: () => import('@/views/Home.vue') },
  { path: '/about',        component: () => import('@/views/About.vue') },
  { path: '/products/:id', component: () => import('@/components/ProductDetail.vue') },

  { path: '/cart',     component: () => import('@/components/Cart.vue') },
  { path: '/checkout', component: () => import('@/components/Checkout.vue'), meta: { requiresAuth: true } },

  { path: '/orders',   component: () => import('@/components/OrderHistory.vue'), meta: { requiresAuth: true } },

  /*  páginas de invitado  */
  { path: '/auth/login',    component: () => import('@/components/Login.vue'), meta: { guestOnly: true } },
  { path: '/auth/register', component: () => import('@/components/Register.vue'), meta: { guestOnly: true } },

  /* 404 opcional */
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })   // vue docs aconsejan así :contentReference[oaicite:1]{index=1}
});

/* ---------- guard global ---------- */
router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();

  /* rutas protegidas sin token → /auth/login */
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ path: '/auth/login', query: { redirect: to.fullPath } });
  }

  /* rutas guestOnly y ya logueado → / */
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return next({ path: '/' });
  }

  next();                       // todo correcto
});

export default router;
