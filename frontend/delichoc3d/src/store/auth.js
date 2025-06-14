import { defineStore } from 'pinia';
import api from '@/services/api';
import { useCartStore } from '@/store/cart';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token : localStorage.getItem('token') || null,
    usuario: JSON.parse(localStorage.getItem('usuario') || 'null')
  }),

  getters: {
    isAuthenticated: s => !!s.token
  },

  actions: {
    /* ---------- Login ---------- */
    async login (correo, contrasena) {
      const { data } = await api.post('/auth/login', { correo, contrasena });

      this.token   = data.token;
      this.usuario = data.usuario;

      localStorage.setItem('token',   data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      /* envía token en cada request a partir de ahora */
      api.defaults.headers.Authorization = `Bearer ${data.token}`;

      /* carga carrito del usuario una vez autenticado */
      await useCartStore().fetch();
    },

    /* ---------- Registro y login inmediato ---------- */
    async register ({ nombre, correo, contrasena }) {
      await api.post('/auth/register', { nombre, correo, contrasena });
      await this.login(correo, contrasena);
    },

    /* ---------- Logout ---------- */
    logout () {
      this.$reset();
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      delete api.defaults.headers.Authorization;
      useCartStore().$reset();
    }
  }
});
