const db = require('../config/db');

/* ------------------- Helpers ------------------- */
// Convierte los DECIMAL que MySQL envía como string
function aNumero (row) {
  return { ...row, precio: Number(row.precio) };
}

/* ------------------- Handlers ------------------ */

// 1) Listar todos los productos
exports.listProducts = async (_req, res) => {
  const [rows] = await db.query(`
    SELECT id,
           nombre,
           descripcion,
           stock,
           CAST(precio AS DECIMAL(10,2)) AS precio,
           imagen
    FROM products
  `);
  res.json(rows.map(aNumero));
};

// 2) Obtener producto por ID
exports.getProductById = async (req, res) => {
  const [[row]] = await db.query(`
    SELECT id,
           nombre,
           descripcion,
           stock,
           CAST(precio AS DECIMAL(10,2)) AS precio,
           imagen
    FROM products
    WHERE id = ?
  `, [req.params.id]);

  if (!row) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(aNumero(row));
};

// 3) Crear producto (solo admin)
exports.createProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;
  const [r] = await db.query(
    'INSERT INTO products (nombre, descripcion, precio, stock, imagen) VALUES (?,?,?,?,?)',
    [nombre, descripcion, precio, stock, imagen]
  );
  res.status(201).json({ id: r.insertId });
};

// 4) Actualizar producto (solo admin)
exports.updateProduct = async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen } = req.body;
  await db.query(
    'UPDATE products SET nombre=?, descripcion=?, precio=?, stock=?, imagen=? WHERE id=?',
    [nombre, descripcion, precio, stock, imagen, req.params.id]
  );
  res.sendStatus(204);
};
