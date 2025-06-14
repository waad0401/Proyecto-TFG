import { defineStore } from 'pinia';
import api from '../services/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],          // siempre copia del servidor
    loaded: false
  }),

  getters: {
    totalItems: s => s.items.reduce((t, i) => t + i.qty, 0),
    totalPrice: s => s.items.reduce((t, i) => t + i.qty * i.price, 0)
  },

  actions: {
    async fetch() {
      if (this.loaded) return;
      const { data } = await api.get('/cart');
      this.items  = data.items;
      this.loaded = true;
    },

    async add(product, qty = 1) {
      await api.post('/cart', { productId: product.id, qty });
      const idx = this.items.findIndex(i => i.id === product.id);
      idx === -1 ? this.items.push({ ...product, qty })
                 : (this.items[idx].qty += qty);
    },

    async remove(id) {
      await api.delete(`/cart/${id}`);
      this.items = this.items.filter(i => i.id !== id);
    },

    async clear() {
      for (const i of this.items) await api.delete(`/cart/${i.id}`);
      this.items = [];
    }
  }
});
