import { defineStore } from 'pinia';
import api from '../services/api';
import { useCartStore } from '../store/cart';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user:  JSON.parse(localStorage.getItem('user') || 'null')
  }),

  getters: {
    isAuthenticated: s => !!s.token
  },

  actions: {
    async login (email, password) {
      const { data } = await api.post('/auth/login', { email, password });
      this.token = data.token;
      this.user  = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user',  JSON.stringify(data.user));
      await useCartStore().fetch();           // Para cargar el carito del usuario
    },

    async register (payload) {
      await api.post('/auth/register', payload);
      await this.login(payload.email, payload.password);
    },

    logout () {
      this.$reset();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      useCartStore().$reset();
    }
  }
});
