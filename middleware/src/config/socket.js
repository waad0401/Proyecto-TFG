import { Server } from 'socket.io';

export function initSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);
    socket.on('disconnect', () => console.log('Socket desconectado'));
  });

  // Helper para que los controladores emitan cambios de stock
  const broadcastStock = (productId, newStock) =>
    io.emit('stockUpdate', { productId, newStock });

  return { io, broadcastStock };
}
