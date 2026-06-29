const Patient = require('../models/Patient');

const PRIORITY_ORDER = { emergency: 0, urgent: 1, normal: 2 };

function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send current queue on connection
    socket.on('queue:fetch', async () => {
      const patients = await Patient.find({ status: 'waiting' }).sort({
        createdAt: 1,
      });
      patients.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      );
      socket.emit('queue:state', patients);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

module.exports = { registerSocketEvents };
