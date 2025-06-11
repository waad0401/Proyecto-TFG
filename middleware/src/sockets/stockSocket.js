/**
 * Socket.IO para notificar actualizaciones de stock en tiempo real.
 */
module.exports = function(io) {
  io.on('connection', socket => {
    console.log('Socket conectado:', socket.id);
    socket.on('subscribeToStock', () => {
      console.log('Cliente suscrito a stock');
    });
    // Desde el controlador de pedidos usa:
    // io.emit('stockUpdated',{ productId,newStock });
  });
};
