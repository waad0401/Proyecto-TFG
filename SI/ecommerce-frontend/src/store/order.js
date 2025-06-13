import { defineStore } from 'pinia';
import api from '../services/api';

export const useOrderStore = defineStore('order', {
  state: () => ({ orders: [] }),
  actions: {
    async fetchOrders () {
      const { data } = await api.get('/orders');
      this.orders = data;
    },
    async checkout (cart) {
      const { data } = await api.post('/orders', { items: cart.items });
      return data;
    }
  }
});
