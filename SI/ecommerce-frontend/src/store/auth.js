import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token'),
    user:  null
  }),
  getters: {
    isAuthenticated: s => !!s.token
  },
  actions: {
    async login (payload) {
      const { data } = await api.post('/auth/login', payload);
      this.token = data.token;
      localStorage.setItem('token', data.token);
    },
    async register (payload) {
      await api.post('/auth/register', payload);
    },
    logout () {
      this.token = null;
      this.user  = null;
      localStorage.removeItem('token');
    }
  }
});
