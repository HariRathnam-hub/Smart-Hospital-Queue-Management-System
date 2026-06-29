const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const patientRoutes = require('./routes/patients');
const queueRoutes = require('./routes/queue');
const { registerSocketEvents } = require('./socket/events');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/queue', queueRoutes(io));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

registerSocketEvents(io);

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital-queue')
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
