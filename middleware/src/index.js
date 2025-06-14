// src/index.js
require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const http     = require('http');
const socketIo = require('socket.io');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes    = require('./routes/cart');   // no necesita io

/* ── Crear app + servidor HTTP ────────────────────────────── */
const app    = express();
const server = http.createServer(app);

/* ── Inicializar Socket.IO ────────────────────────────────── */
const io = socketIo(server, { cors: { origin: '*' } });

/* ── Rutas que NECESITAN io (se importan después de crearlo) ─*/
const orderRoutes   = require('./routes/orders')(io); // inyecta io

/* ── Middlewares globales ─────────────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ── Rutas REST ───────────────────────────────────────────── */
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);   // con io

/* ── WebSocket canal stock ────────────────────────────────── */
require('./sockets/stockSocket')(io);

/* ── Lanzar servidor ──────────────────────────────────────── */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API Delichoc 3D escuchando en puerto ${PORT}`);
});
