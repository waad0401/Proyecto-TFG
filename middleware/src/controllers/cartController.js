const db = require('../config/db');

// helper: asegura que el usuario tiene carrito
async function ensureCart (usuarioId) {
  const [[row]] = await db.query(
    'SELECT id FROM carts WHERE usuario_id = ?',
    [usuarioId]
  );
  if (row) return row.id;

  const [r] = await db.query(
    'INSERT INTO carts (usuario_id) VALUES (?)',
    [usuarioId]
  );
  return r.insertId;
}

// GET /cart
exports.getCart = async (req, res) => {
  const carritoId = await ensureCart(req.user.id);
  const [items] = await db.query(
    `SELECT producto_id AS productoId,
            cantidad     AS cantidad
       FROM cart_items
      WHERE carrito_id = ?`,
    [carritoId]
  );
  res.json({ items });
};

// POST /cart   body: { productoId, cantidad }
exports.addToCart = async (req, res) => {
  const { productoId, cantidad } = req.body;
  const carritoId = await ensureCart(req.user.id);

  await db.query(
    `INSERT INTO cart_items (carrito_id, producto_id, cantidad)
         VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE
       cantidad = cantidad + VALUES(cantidad)`,
    [carritoId, productoId, cantidad]
  );
  res.sendStatus(204);
};

// DELETE /cart/:pid   (pid numérico → definido en la ruta /:pid(\\d+))
exports.removeFromCart = async (req, res) => {
  const pid = Number(req.params.pid);
  if (!pid) return res.status(400).json({ msg: 'ID inválido' });

  const carritoId = await ensureCart(req.user.id);
  await db.query(
    'DELETE FROM cart_items WHERE carrito_id = ? AND producto_id = ?',
    [carritoId, pid]
  );
  res.sendStatus(204);
};
