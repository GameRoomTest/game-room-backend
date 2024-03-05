import Room from "./room/room";
import { Event, Player, Socket } from "./types";

export const createGame = (data: Data, socket: Socket) => {
  const roomCode = Room.createRoom(data, socket.id);
    
  socket.emit(Event.GAME_CREATED, roomCode)
}

type Data = Pick<Player, 'id' | 'name'>;
