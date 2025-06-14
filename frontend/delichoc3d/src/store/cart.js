import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from '@/store/auth';

export const useCartStore = defineStore('cart', {
  /* ---------- state ---------- */
  state: () => ({
    items: [],        // [{ productoId, cantidad, nombre, precio, imagen }]
    loaded: false
  }),

  /* ---------- getters ---------- */
  getters: {
    totalItems  : s => s.items.reduce((t, i) => t + i.cantidad, 0),
    totalPrecio : s => s.items.reduce((t, i) => t + i.cantidad * i.precio, 0)
  },

  /* ---------- actions ---------- */
  actions: {
    /* 1) Cargar carrito del usuario después de login */
    async fetch () {
      if (this.loaded) return;                     // evita doble llamada
      try {
        const { data } = await api.get('/cart');   // GET /api/cart
        this.items  = data.items;                  // [{ productoId, cantidad }]
        this.loaded = true;
      } catch (e) {
        console.error('Error cargando carrito:', e);
      }
    },

    /* 2) Añadir producto (bloquea invitados) */
    async add (producto, cantidad = 1) {
      const auth = useAuthStore();

      if (!auth.isAuthenticated) {
        alert('Debes iniciar sesión para comprar');
        window.location.href = '/auth/login';
        return false;                              // indica redirección
      }

      await api.post('/cart', {                    // POST /api/cart
        productoId: producto.id,
        cantidad
      });

      const idx = this.items.findIndex(i => i.productoId === producto.id);
      if (idx === -1) {
        this.items.push({
          productoId : producto.id,
          nombre     : producto.nombre,
          precio     : producto.precio,
          imagen     : producto.imagen,
          cantidad
        });
      } else {
        this.items[idx].cantidad += cantidad;
      }
      return true;
    },

    /* 3) Quitar línea */
    async remove (productoId) {
      await api.delete(`/cart/${productoId}`);     // DELETE /api/cart/:productoId
      this.items = this.items.filter(i => i.productoId !== productoId);
    },

    /* 4) Vaciar (después de checkout) */
    async clear () {
      const copia = [...this.items];
      for (const i of copia) {
        await api.delete(`/cart/${i.productoId}`);
      }
      this.items = [];
    }
  }
});
