require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'cambiame';

/**
 * Middleware que valida el JWT en el header Authorization.
 * Si es válido, añade payload en req.user.
 */
module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    res.status(403).json({ message: 'Token inválido o expirado' });
  }
};
