import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

// Own
import { PORT } from './constants';
import { Event } from './socket/tateti/types';
// import { Data as CreateGameData } from './socket/tateti/create-game';

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

export interface Player {
  id: string;
  name: string;
  socketId: string;
}

type Code = string;

export interface Room {
  code: Code;
  players: Player[];
}

const rooms: Record<Code, Room> = {}

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    const userDisconnectedSocketId = socket.id;

    const room = Object.values(rooms)
      .find(r => r.players.some(p => p.socketId === userDisconnectedSocketId))
    
    if(!room) return;

    const roomCode = room.code;

    const playerTwo = room.players.filter(x => x.socketId !== userDisconnectedSocketId)[0];
    
    // Eliminamos la sala del usuario que se desconecto
    delete rooms[roomCode]

    // Echar al otro usuario de la sala
    io.sockets.sockets.forEach(x => {
      if(x.id === playerTwo.socketId) {
        x.disconnect()
      }
    })

    console.log('room deleted', roomCode);
  });

  socket.on(Event.CREATE_GAME, (data: Pick<Player, 'id' | 'name'>) => {
    const roomCode = createRoom(data, socket.id);
    
    socket.emit(Event.GAME_CREATED, roomCode)
  })

  socket.on(Event.JOIN_GAME, (data: Player & {code: Code}) => {
    const {code, ...player} = data;

    const joinStatus = joinRoom(code, player, socket.id);

    if(joinStatus) {
      const room = rooms[code];

      socket.emit(Event.JOINED_IN_GAME, room)
      console.log(JSON.stringify(rooms))
    } else {
      socket.emit(Event.ERROR_JOINING)
    }
  })
});

function joinRoom(code: Code, player: Player, socketId: string): boolean {
  const room = rooms[code];

  if(room && room.players.length === 1) {
    const currentPlayer = rooms[code].players[0];

    if(currentPlayer.id !== player.id) {
      rooms[code].players.push({...player, socketId});
      return true
    }
  }

  return false
}

function createRoom(player: Pick<Player, 'id' | 'name'>, socketId: string) {
  const code = generateRandomCode();

  rooms[code] = {
    code,
    players: [{...player, socketId}]
  }

  return code;
}

function generateRandomCode(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const length = 6;

  let result = '';

  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
}
