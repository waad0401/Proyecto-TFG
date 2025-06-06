import { pool } from '../config/db.js';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../middleware/hash.js';
import { validationResult } from 'express-validator';

export const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const [exists] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (exists.length) return res.status(409).json({ error: 'Email ya registrado' });

    const pwdHash = await hashPassword(password);
    await pool.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, pwdHash]);

    res.status(201).json({ message: 'Usuario creado' });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT id, password FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

    const valid = await comparePassword(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: rows[0].id, email }, process.env.JWT_SECRET, { expiresIn: '2h' }); // RFC 7519 :contentReference[oaicite:3]{index=3}
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
