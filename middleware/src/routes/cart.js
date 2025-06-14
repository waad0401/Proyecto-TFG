const express = require('express');
const auth    = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

// Para proteger todas las rutas y que se necesito el JWT (estar logeado)
router.use(auth);

/* ---- End-points ---- */
router.get('/', getCart);           // GET  /api/cart
router.post('/', addToCart);        // POST /api/cart

// para eliminar productos del carrito
router.delete('/:pid(\\d+)', removeFromCart);

module.exports = router;
