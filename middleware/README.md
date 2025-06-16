### Cambios a realizar importantes 
```
middleware/
├── src/
│   ├── index.js            # punto de entrada Express + socket.io
│   ├── config/
│   │   └── db.js           # conexión pool MySQL2
│   ├── controllers/        # lógica de negocio
│   ├── routes/             # definición de endpoints y uso de auth
│   ├── middleware/
│   │   └── auth.js         # verifica JWT
│   └── sockets/
│       └── stockSocket.js  # notificaciones de stock por WebSocket
├── .env                    # variables de entorno (JWT_SECRET, BBDD)
└── package.json            # dependencias y scripts
```
### Funciones
#### src/index.js
- Carga variables de entorno (dotenv) y middlewares básicos (cors, express.json, morgan) para logging de peticiones.
- Montamos todas la rutas que se emplearan en la app web para su contruccion dinamica: /api/auth, /api/products, /api/orders, /api/cart, /api/comments.
- Inizializamos sockets con stockSocket(io) para emitir cambios de stock, tambien hacemos escucha el puerto (process.env.PORT o 3000).

#### src/config/db.js
- En este archivo nos permite tener una conexion con la BD y solicitar los datos que vamos requiriendo

#### src/controllers/
- authController.js : Con este archivo controlamos todo lo referente a la parte del login tanto de crear como logearse 
- productController.js: Con este controlador gestionamos todo lo relacionado con los productos, preparados para ser solicitados para la api,
- orderController.js: Con este controlador gestionamos todos pedidos para realizarlos, y para observar pedidos anteriores.
- cartController.js: Con este controlador gestionamos todas, todas las funciones del carrito , asignado por usuario
- commentController.js: Con este controlador lista y crea comentarios asociados a productos.

#### src/routes/
Cada archivo exporta un router de Express que usa auth middleware para proteger las rutas necesarias.
auth.js: POST /register, /login.
products.js: GET /, GET /:id, POST, PUT, DELETE (admin).
orders.js: POST / (placeOrder con io), GET /my.
cart.js: GET /, POST /, DELETE /:pid.
comments.js: GET /:id, POST /:id (protege con auth)

#### middleware/auth.js 
En este archivo se decodifica JWT (del header Authorization), adjunta req.user y bloquea rutas si no hay token válido.

#### src/sockets/stockSocket.js
Escucha eventos stockUpdated y retransmite a todos los clientes conectados.