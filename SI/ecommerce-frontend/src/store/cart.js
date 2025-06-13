import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({ items: [] }),
  getters: {
    total: s => s.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },
  actions: {
    add (item) {
      const exist = this.items.find(i => i.id === item.id);
      exist ? (exist.qty += item.qty) : this.items.push(item);
    },
    remove (id) { this.items = this.items.filter(i => i.id !== id); },
    clear ()   { this.items = []; }
  }
});
