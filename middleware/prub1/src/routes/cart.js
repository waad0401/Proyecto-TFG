import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCart,
  addToCart,
  removeFromCart
} from '../controllers/cart.controller.js';

export default function (broadcastStock) {
  const router = Router();

  router.get('/', getCart);

  router.post(
    '/',
    [
      body('productId').isInt({ gt: 0 }),
      body('quantity').isInt({ gt: 0 })
    ],
    (req, res, next) => addToCart(req, res, next, broadcastStock)
  );

  router.delete(
    '/:productId',
    param('productId').isInt({ gt: 0 }),
    removeFromCart
  );

  return router;
}
