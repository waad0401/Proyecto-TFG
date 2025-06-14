const db = require('../config/db');

/* ---------- Crear pedido (inyecta io) ---------- */
exports.placeOrder = (io) => async (req, res) => {
  const { items, total } = req.body;            // items = [{ productoId, cantidad, precio }]
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    /* 1) crea pedido */
    const [pedidoRes] = await conn.query(
      'INSERT INTO orders (usuario_id, total) VALUES (?,?)',
      [req.user.id, total]
    );
    const pedidoId = pedidoRes.insertId;

    /* 2) inserta líneas + actualiza stock */
    for (const it of items) {
      await conn.query(
        `INSERT INTO order_items (pedido_id, producto_id, cantidad, precio)
         VALUES (?,?,?,?)`,
        [pedidoId, it.productoId, it.cantidad, it.precio]
      );

      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [it.cantidad, it.productoId]
      );

      /* notifica stock actualizado */
      const [[{ stock }]] = await conn.query(
        'SELECT stock FROM products WHERE id = ?', [it.productoId]
      );
      io.emit('stockActualizado', {
        productoId: it.productoId,
        nuevoStock: stock
      });
    }

    await conn.commit();
    res.status(201).json({ pedidoId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ mensaje: 'Error al crear pedido', err });
  } finally {
    conn.release();
  }
};

/* ---------- Pedidos del usuario logueado ---------- */
exports.getUserOrders = async (req, res) => {
  const [filas] = await db.query(
    'SELECT id, total, fecha, estado FROM orders WHERE usuario_id = ?',
    [req.user.id]
  );
  res.json(filas);
};
