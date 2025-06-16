const express = require('express');
const comments = require('./comments');


const router  = express.Router();
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct
} = require('../controllers/productController');

// Para el uso de comentarios en los productos
router.use('/:id/comments', comments());

router.get('/', listProducts);
router.get('/:id', getProductById);

// No empleados 100% 
router.post('/',  createProduct);
router.put('/:id', updateProduct);

module.exports = router;
