require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const db     = require('../config/db');

const SECRET = process.env.JWT_SECRET;         


// Registro de usuario – POST /api/auth/register

exports.register = async (req, res) => {
  const { nombre, correo, contrasena } = req.body;

  try {
    /* 1) hashea la contraseña */
    const hash = await bcrypt.hash(contrasena, 10);

    /* 2) guarda en la tabla con los nuevos nombres */
    await db.query(
      'INSERT INTO users (nombre, correo, contrasena) VALUES (?,?,?)',
      [nombre, correo, hash]
    );

    res.status(201).json({ mensaje: 'Usuario creado' });
  } catch (err) {
    /* duplicado de correo → 409 */
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'El correo ya existe' });
    }
    console.error(err);
    res.status(500).json({ mensaje: 'Error al registrar' });
  }
};


// Login – POST /api/auth/login
exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  // 1) busca por correo
  const [[usuario]] = await db.query(
    'SELECT id, nombre, correo, contrasena FROM users WHERE correo = ?',
    [correo]
  );

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  // 2) compara la contraseña
  const ok = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!ok) {
    return res.status(401).json({ mensaje: 'Credenciales inválidas' });
  }

  // 3) genera token 
  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo },
    SECRET,
    { expiresIn: '3d' }
  );

  // 4) responde con token y datos básicos
  res.json({
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo }
  });
};
