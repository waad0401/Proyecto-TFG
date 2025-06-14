require('dotenv').config();               // carga variables de entorno

const express    = require('express');
const cors       = require('cors');
const morgan     = require('morgan');
const http       = require('http');
const socketIo   = require('socket.io');

const auth       = require('./middleware/auth');         // ← ahora sí definido
const productRoutes = require('./routes/products');
const authRoutes    = require('./routes/auth');
const cartRoutes    = require('./routes/cart');
const orderRoutes   = require('./routes/orders');        // requiere io más abajo

const app    = express();
const server = http.createServer(app);
const io     = socketIo(server, { cors: { origin: '*' } });

/* -------------------- Middlewares -------------------- */
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

/* ------------- Rutas sin autenticación ------------- */
app.use('/api/auth',    authRoutes);
app.use('/api/products', productRoutes);

// Las rutas que requieren usuario logueado usan `auth`
app.use('/api/cart',    auth, cartRoutes);
app.use('/api/orders',  auth, orderRoutes(io));  // <-- pasamos `io` aquí

/*  WebSocket para stock en tiempo real */
const stockSocket = require('./sockets/stockSocket');
stockSocket(io);

/* ------------------- Inicio servidor ------------------- */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
