/* -----------------------------------------------------------
   server.js — Punto de entrada de la API e-commers
   Requiere que package.json tenga: { "type": "module" }
----------------------------------------------------------- */

import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { verifyToken } from './middleware/auth.js';
import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes    from './routes/cart.js';          // opcional
import { initSocket } from './config/socket.js';

dotenv.config();

const app = express();
app.use(cors());              // Permite peticiones desde http://localhost:4200
app.use(express.json());      // Body-parser JSON

/* ----------  Rutas públicas  -------------------------------- */
app.get('/', (_req, res) => res.send('API e-commers OK'));
app.use('/api/auth', authRoutes);                      // login / register

/* ----------  Rutas protegidas (requieren JWT) --------------- */
app.use('/api/products', verifyToken);
app.use('/api/cart',     verifyToken);                 // si implementas carrito

/* ----------  Servidor HTTP + Socket.IO  --------------------- */
const server = http.createServer(app);
const { io, broadcastStock } = initSocket(server);

/*  Autenticación opcional en el handshake Socket.IO
    El front envía el token con: io({ auth:{ token }})
---------------------------------------------------------------- */
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next();                          // permitir sockets públicos
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(err);
    socket.user = decoded;                            // { id, email }
    next();
  });
});

/* ----------  Registro de rutas que necesitan broadcastStock - */
app.use('/api/products', productRoutes(broadcastStock));
app.use('/api/cart',     cartRoutes(broadcastStock));  // opcional

/* ----------  Manejador global de errores -------------------- */
app.use((err, _req, res, _next) => {
  console.error(err);

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(403).json({ error: 'Token inválido' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

// POLITICA DEL CORS
const allowed = ['https://front.example.com'];      // dominios permitidos
app.use(cors({ origin: allowed, credentials: true }));  // ← se aplica a TODAS las rutas

/* ----------  Arranque del servidor  ------------------------- */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`API escuchando en http://localhost:${PORT}`)
);
