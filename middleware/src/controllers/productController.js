const db = require('../config/db');

// Devuelve todos los productos
exports.listProducts = async (_req, res) => {
  const [rows] = await db.query('SELECT * FROM products');
  res.json(rows);
};

// Devuelve un producto por id
exports.getProductById = async (req, res) => {
  const [[row]] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
  if (!row) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(row);
};

// Crea producto (admin) — la imagen es solo un nombre de archivo
exports.createProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;  // image = 'cookie.jpg'
  const [r] = await db.query(
    'INSERT INTO products (name, description, price, stock, image) VALUES (?,?,?,?,?)',
    [name, description, price, stock, image]
  );
  res.status(201).json({ id: r.insertId });
};

// Actualiza producto (admin)
exports.updateProduct = async (req, res) => {
  const { name, description, price, stock, image } = req.body;
  await db.query(
    'UPDATE products SET name=?, description=?, price=?, stock=?, image=? WHERE id=?',
    [name, description, price, stock, image, req.params.id]
  );
  res.sendStatus(204);
};
