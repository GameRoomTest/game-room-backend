import { Server } from "socket.io";
import Room from "./room/room";

export const disconnect = (userDisconnectedSocketId: string, io: Server) => {
  const room = Room.getRoomByPlayerSocketId(userDisconnectedSocketId);
  
  if(!room) return;

  const roomCode = room.code;

  const playerTwo = room.players.filter(x => x.socketId !== userDisconnectedSocketId)[0];
  
  // Eliminamos la sala del usuario que se desconecto
  Room.deleteRoom(roomCode);

  // Echar al otro usuario de la sala
  io.sockets.sockets.forEach(x => {
    if(x.id === playerTwo.socketId) {
      x.disconnect()
    }
  })

  console.log('room deleted', roomCode);
}
