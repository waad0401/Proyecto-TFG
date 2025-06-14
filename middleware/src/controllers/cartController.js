/* --------------------------------------------------------------------------
   Controlador de carrito
-------------------------------------------------------------------------- */
const db            = require('../config/db');
const { randomUUID } = require('crypto');

/* ---------- helper: obtiene o crea carrito ---------- */
async function ensureCart (usuarioId) {
  const [[row]] = await db.query(
    'SELECT id FROM carts WHERE usuario_id = ?',
    [usuarioId]
  );
  if (row) return row.id;

  const carritoId = randomUUID();
  await db.query(
    'INSERT INTO carts (id, usuario_id) VALUES (?,?)',
    [carritoId, usuarioId]
  );
  return carritoId;
}

/* ---------------- GET /api/cart ---------------- */
exports.getCart = async (req, res) => {
  const carritoId = await ensureCart(req.user.id);
  const [items] = await db.query(
    `SELECT producto_id AS productoId,
            cantidad    AS cantidad
       FROM cart_items
      WHERE carrito_id = ?`,
    [carritoId]
  );
  res.json({ items });
};

/* -------- POST /api/cart  body:{ productoId, cantidad } -------- */
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

/* ------------- DELETE /api/cart/:productoId -------------- */
exports.removeFromCart = async (req, res) => {
  const productoId = req.params.productoId;
  const carritoId  = await ensureCart(req.user.id);

  await db.query(
    'DELETE FROM cart_items WHERE carrito_id = ? AND producto_id = ?',
    [carritoId, productoId]
  );
  res.sendStatus(204);
};
