const db = require('../config/db');

/**
 * GET /api/products
 */
exports.getAll = async (req, res) => {
  const [products] = await db.query('SELECT * FROM products');
  res.json(products);
};

/**
 * GET /api/products/:id
 */
exports.getById = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!rows.length) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }
  res.json(rows[0]);
};
