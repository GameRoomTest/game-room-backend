import { Server } from "socket.io";
import Room from "./room/room";
import { Event, Player } from "./types";

export const move = (data: Data, io: Server) => {
  const {position, playerId} = data;

  Room.move(position, playerId);

  SearchEmitMoveTheOtherPlayer(io, playerId, position)
  
  const isWinner = Room.checkWinner(playerId);

  if(isWinner){
    const code = Room.getCodeRoomByPlayerId(playerId);
    const room = Room.getRoom(code as string); 
    const socketIds = Object.values(room.players).map(p => p.socketId);

    emitWinnerPlayer(io,socketIds, playerId)
  }
}
export interface Data {
  position: number;
  playerId: Player['id'];
}

function emitWinnerPlayer(io: Server, socketIds: string[], playerWinnerId: string ) {
  io.sockets.sockets.forEach(x => {
    if(socketIds.includes(x.id)) {
      x.emit(Event.WINNER, {playerId : playerWinnerId } )
    }
  })
  
  console.log('alguien ganó', playerWinnerId)
}

function SearchEmitMoveTheOtherPlayer(io:Server, playerId: string, position: number) {
  const code = Room.getCodeRoomByPlayerId(playerId);
  const room = Room.getRoom(code as string); 
  const otherPlayer = Object.values(room.players).find(p=> p.id !== playerId)

  io.sockets.sockets.forEach(x => {
    if(otherPlayer?.socketId === x.id ) {
      x.emit(Event.ON_MOVE, {position});
    }
  })
}
