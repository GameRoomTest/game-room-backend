import Room from "./room/room";
import { Code, Event, Player, Socket } from "./types";

export const joinGame = (data: Data, socket: Socket) => {
  const {code, ...player} = data;

  const joinStatus = Room.joinRoom(code, player, socket.id);

  if(joinStatus) {
    const room = Room.getRoom(code);

    socket.emit(Event.JOINED_IN_GAME, room)
  } else {
    socket.emit(Event.ERROR_JOINING)
  }
}

interface Data extends Player {
  code: Code;
}
