import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const routes = [
  { path: '/',              component: () => import('@/views/Home.vue') },
  { path: '/about',         component: () => import('@/views/About.vue') },
  { path: '/products/:id',  component: () => import('@/components/ProductDetail.vue') },
  { path: '/cart',          component: () => import('@/components/Cart.vue') },
  { path: '/checkout',      component: () => import('@/components/Checkout.vue'), meta:{ requiresAuth:true } },
  { path: '/orders',        component: () => import('@/components/OrderHistory.vue'), meta:{ requiresAuth:true } },
  { path: '/auth/login',    component: () => import('@/components/Login.vue') },
  { path: '/auth/register', component: () => import('@/components/Register.vue') }
];

const router = createRouter({ history: createWebHistory(), routes });

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ path: '/auth/login', query: { redirect: to.fullPath } });
  } else next();
});
export default router;
