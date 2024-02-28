import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

// Own
import { PORT } from './constants';

// Create server
const app = express();
const server = createServer(app);

// Create socket instance
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', (data) => {
    console.log(data);
  });
});
