require('dotenv').config();  // Carga .env
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes   = require('./routes/orders');
const stockSocket   = require('./sockets/stockSocket');

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Socket.IO
stockSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
