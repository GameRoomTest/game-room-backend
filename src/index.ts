import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

// Own
import { PORT } from './constants';
import { Event } from './socket/tateti/types';
import { createGame } from './socket/tateti/create-game';
import { joinGame } from './socket/tateti/join-game';
import { disconnect } from './socket/tateti/disconnect';
import { move } from './socket/tateti/move';

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
  
  socket.on('disconnect', () => disconnect(socket.id, io));

  socket.on(Event.CREATE_GAME, (data) => createGame(data, socket));

  socket.on(Event.JOIN_GAME, (data) => joinGame(data, socket, io));

  socket.on(Event.MOVE, (data) => move(data, io));
});
