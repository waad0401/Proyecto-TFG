module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);

    // Puedes añadir más eventos aquí si necesitas
    socket.on('disconnect', () => console.log('Socket desconectado:', socket.id));
  });
};
