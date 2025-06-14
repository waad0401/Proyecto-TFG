const express = require('express');
const router  = express.Router();
const {
  listProducts,
  getProductById,
  createProduct,
  updateProduct
} = require('../controllers/productController');

router.get('/', listProducts);
router.get('/:id', getProductById);

// CRUD opcional (protegido con auth / admin)
router.post('/',  createProduct);
router.put('/:id', updateProduct);

module.exports = router;
