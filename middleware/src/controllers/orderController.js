const db = require('../config/db');

/**
 * POST /api/orders
 */
exports.placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body; // [{ productId, quantity }]
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const [orderResult] = await conn.query(
      'INSERT INTO orders (user_id, total) VALUES (?, ?)',
      [userId, total]
    );
    const orderId = orderResult.insertId;
    for (const it of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, it.productId, it.quantity, it.price]
      );
      await conn.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [it.quantity, it.productId]
      );
    }
    await conn.commit();
    res.status(201).json({ id: orderId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error al crear pedido' });
  } finally {
    conn.release();
  }
};

/**
 * GET /api/orders/my
 */
exports.getUserOrders = async (req, res) => {
  const userId = req.user.id;
  const [orders] = await db.query(
    `SELECT o.id,o.total,o.date,o.status,
      JSON_ARRAYAGG(JSON_OBJECT(
        'productId',oi.product_id,'quantity',oi.quantity,'price',oi.price
      )) AS items
     FROM orders o
     JOIN order_items oi ON o.id=oi.order_id
     WHERE o.user_id=?
     GROUP BY o.id`,
    [userId]
  );
  res.json(orders);
};
