import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { listProducts, getProduct, updateStock }
  from '../controllers/product.controller.js';

export default function (broadcastStock) {
  const router = Router();

  router.get(
    '/',
    [
      query('page').optional().isInt({ min: 1 }).toInt(),
      query('size').optional().isInt({ min: 1, max: 100 }).toInt()
    ],
    listProducts
  );

  router.get('/:id', param('id').isInt({ gt: 0 }), getProduct);

  router.put(
    '/:id/stock',
    [
      param('id').isInt({ gt: 0 }),
      body('quantity').isInt({ gt: 0 })
    ],
    (req, res, next) => updateStock(req, res, next, broadcastStock)
  );

  return router;
}
