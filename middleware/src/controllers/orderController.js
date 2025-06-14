const db = require('../config/db');

// Generador de handler inyectando io
exports.placeOrder = (io) => async (req, res) => {
  const { items, total } = req.body;          // items = [{ productId, quantity, price }]
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 1) crea pedido
    const [orderRes] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?,?)',
      [req.user.id, total]
    );
    const orderId = orderRes.insertId;

    // 2) inserta líneas y actualiza stock
    for (const it of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?,?,?,?)',
        [orderId, it.productId, it.quantity, it.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [it.quantity, it.productId]
      );

      // notifica stock actualizado
      const [[{ stock }]] = await conn.query('SELECT stock FROM products WHERE id=?', [it.productId]);
      io.emit('stockUpdated', { productId: it.productId, newStock: stock });
    }

    await conn.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al crear pedido', err });
  } finally {
    conn.release();
  }
};

// Pedidos del usuario
exports.getUserOrders = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
  res.json(rows);
};
