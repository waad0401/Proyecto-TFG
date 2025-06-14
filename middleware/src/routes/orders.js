// src/routes/orders.js

const express = require('express');
const auth    = require('../middleware/auth');       // middleware JWT
const {
  placeOrder,
  getUserOrders
} = require('../controllers/orderController');

module.exports = (io) => {
  const router = express.Router();

  // 1) Todas las rutas de este router requieren auth
  router.use(auth);

  // 2) POST /api/orders  → crea pedido (pasa io al controlador)
  router.post('/', placeOrder(io));

  // 3) GET  /api/orders  → lista pedidos del usuario
  router.get('/', getUserOrders);

  return router;
};
