import { Server } from "socket.io";
import Room from "./room/room";
import { Player } from "./types";

export const move = (data: Data, io: Server) => {
  const {position, playerId} = data;

  Room.move(position, playerId);

  const isWinner = Room.checkWinner(playerId);

  if(isWinner){
    emitWinnerPlayer()
  }
}

interface Data {
  position: number;
  playerId: Player['id'];
}

function emitWinnerPlayer() {
  // emitir Event.WINNER a los dos players del room
  console.log('alguien ganó')
}
