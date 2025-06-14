/* --------------------------------------------------------------------------
   Controlador de pedidos
-------------------------------------------------------------------------- */
const db            = require('../config/db');
const { randomUUID } = require('crypto');          // UUID v4 nativo

/* ---------------- Crear pedido ---------------- */
exports.placeOrder = (io) => async (req, res) => {
  /* 1) Verifica autenticación */
  if (!req.user?.id) {
    return res.status(401).json({ mensaje: 'No autenticado' });
  }

  const { items, total } = req.body;              // [{ productoId, cantidad, precio }]
  const pedidoId = randomUUID();                  // p.ej. '830bc625-c096-…'

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    /* 2) Cabecera de pedido (estado pendiente) */
    await conn.query(
      'INSERT INTO orders (id, usuario_id, total, estado) VALUES (?,?,?,?)',
      [pedidoId, req.user.id, total, 'pendiente']
    );

    /* 3) Detalle de líneas + actualización de stock */
    for (const i of items) {
      await conn.query(
        `INSERT INTO order_items (pedido_id, producto_id, cantidad, precio)
         VALUES (?,?,?,?)`,
        [pedidoId, i.productoId, i.cantidad, i.precio]
      );

      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [i.cantidad, i.productoId]
      );

      /* 4) WebSocket: notifica nuevo stock */
      const [[{ stock }]] = await conn.query(
        'SELECT stock FROM products WHERE id = ?', [i.productoId]
      );
      io.emit('stockActualizado', {
        productoId: i.productoId,
        nuevoStock: stock
      });
    }

    await conn.commit();
    res.status(201).json({ pedidoId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ mensaje: 'Error al crear pedido' });
  } finally {
    conn.release();
  }
};

/* ---------------- Pedidos del usuario ---------------- */
exports.getUserOrders = async (req, res) => {
  const [filas] = await db.query(
    'SELECT id, total, fecha, estado \
       FROM orders \
      WHERE usuario_id = ? \
      ORDER BY fecha DESC',
    [req.user.id]
  );
  res.json(filas);
};
