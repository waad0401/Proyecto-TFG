// src/index.js

require('dotenv').config();              // Carga .env al iniciar
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
const http       = require('http');
const socketIo   = require('socket.io');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const morgan    = require('morgan');
const stockSocket   = require('./sockets/stockSocket');

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, { cors: { origin: '*' } });

// 1) Middlewares generales
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// 3) Rutas de la API REST
app.use('/api/auth',    authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// 4) Canal de WebSockets para notificar stock en tiempo real
stockSocket(io);

// 5) Arranque del servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
