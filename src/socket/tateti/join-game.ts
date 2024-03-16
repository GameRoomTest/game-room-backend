import { io } from "socket.io-client";
import Room from './room/room';
import { Code, Event, Player, Socket } from "./types";
import { Server } from "socket.io";

export const joinGame = (data: Data, socket: Socket, io: Server) => {
  const {code, ...player} = data;

  const joinStatus = Room.joinRoom(code, player, socket.id);

  if(joinStatus) {
    const room = Room.getRoom(code);

    io.sockets.sockets.forEach(currentSocket => {
      const socketIds = Object.values(room.players).map(p => p.socketId)

      if(socketIds.includes(currentSocket.id)){
        console.log(currentSocket.id)
        currentSocket.emit(Event.JOINED_IN_GAME, room)
      }
    })
  } else {
    socket.emit(Event.ERROR_JOINING)
  }
  
}

interface Data extends Player {
  code: Code;
}
