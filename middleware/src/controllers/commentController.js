const db = require('../config/db');

// GET  /products/:id/comments
exports.list = async (req, res) => {
  const [rows] = await db.query(
    `SELECT c.id,
            c.contenido      AS contenido,
            c.creado_en      AS creado_en,
            u.nombre         AS usuario
       FROM comments c
       JOIN users u  ON u.id = c.usuario_id
      WHERE c.producto_id = ?
      ORDER BY c.creado_en DESC`,
    [req.params.id]
  );
  res.json(rows);
};

// POST /products/:id/comments   body: { contenido }
exports.create = async (req, res) => {
  const { contenido } = req.body;
  if (!contenido) return res.status(400).json({ msg: 'empty' });

  await db.query(
    `INSERT INTO comments (producto_id, usuario_id, contenido)
         VALUES (?,?,?)`,
    [req.params.id, req.user.id, contenido]
  );
  res.sendStatus(201);
};
