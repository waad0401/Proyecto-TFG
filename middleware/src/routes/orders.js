const express = require('express');
const auth    = require('./auth');                     // middleware JWT
const {
  placeOrder,
  getUserOrders
} = require('../controllers/orderController');

module.exports = (io) => {
  const router = express.Router();

  router.post('/', auth, placeOrder(io));   // pasa io al controlador
  router.get('/my', auth, getUserOrders);

  return router;
};
