import { pool } from '../config/db.js';
import { validationResult } from 'express-validator';

export const listProducts = async (req, res, next) => {
  const page   = req.query.page ?? 1;
  const size   = req.query.size ?? 20;
  const offset = (page - 1) * size;

  try {
    const [rows] = await pool.execute(
      `SELECT id, name, price, stock, image_url
         FROM products
        LIMIT ? OFFSET ?`, [Number(size), Number(offset)]
    );
    res.json(rows);
  } catch (err) { next(err); }
};

export const getProduct = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, name, price, stock, image_url
         FROM products
        WHERE id = ?`, [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) { next(err); }
};

export const updateStock = async (req, res, next, broadcastStock) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { id }      = req.params;
  const { quantity } = req.body;

  try {
    const [result] = await pool.execute(
      `UPDATE products
          SET stock = stock - ?
        WHERE id    = ? AND stock >= ?`, [quantity, id, quantity]
    );
    if (result.affectedRows === 0)
      return res.status(409).json({ error: 'Sin stock' });

    const [[{ stock }]] = await pool.execute(
      'SELECT stock FROM products WHERE id = ?', [id]
    );
    broadcastStock(id, stock);
    res.json({ ok: true });
  } catch (err) { next(err); }
};
