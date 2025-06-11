const express = require('express');
const auth = require('../middleware/auth');
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const router = express.Router();

router.post('/', auth, placeOrder);
router.get('/my', auth, getUserOrders);

module.exports = router;
