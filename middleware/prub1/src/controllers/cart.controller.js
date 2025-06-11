import { pool } from '../config/db.js';
import { validationResult } from 'express-validator';

export const getCart = async (req, res, next) => {
  try {
    const [items] = await pool.execute(
      `SELECT c.product_id AS productId, c.quantity,
              p.name, p.price, p.image_url
         FROM cart c
         JOIN products p ON p.id = c.product_id
        WHERE c.user_id = ?`, [req.user.id]
    );
    res.json(items);
  } catch (err) { next(err); }
};

export const addToCart = async (req, res, next, broadcastStock) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { productId, quantity } = req.body;
  try {
    await pool.execute(
      `INSERT INTO cart (user_id, product_id, quantity)
            VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, productId, quantity]
    );
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    await pool.execute(
      'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.id, req.params.productId]
    );
    res.status(204).end();
  } catch (err) { next(err); }
};
