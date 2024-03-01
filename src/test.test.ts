import { createServer } from "node:http";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { PORT } from "./constants";
import { Event } from "./socket/tateti/types";
import { Player, Room } from ".";

const httpServer = createServer();
let clientSocket: ClientSocket;
let clientSocket2: ClientSocket;

httpServer.listen(() => {
  clientSocket = ioc(`http://localhost:${PORT}`);
  clientSocket2 = ioc(`http://localhost:${PORT}`);

  clientSocket.on("connect", () => {
    console.log('I am the player ONE');
  });

  clientSocket.on("disconnect", () => {
    console.log('Player ONE disconnected');
  });

  const player = {
    id: '123qwe',
    name: 'Dani',
  }

  clientSocket.emit(Event.CREATE_GAME, player)

  clientSocket.on(Event.GAME_CREATED, (roomCode: string) => {
    // mostrar codigo en la UI
    console.log(roomCode)

    joinPlayerTwo(roomCode)
  })

  function joinPlayerTwo(code: string) {
    const joinGameData = {
      id: 'zxc789',
      name: 'Karen',
    }

    clientSocket2.on("connect", () => {
      console.log('I am the player TWO');
    });

    clientSocket2.on("disconnect", () => {
      console.log('Player TWO disconnected');
    });

    clientSocket2.emit(Event.JOIN_GAME, { ...joinGameData, code })
    
    clientSocket2.on(Event.JOINED_IN_GAME, (room: Room) => {
      console.log(room)

      clientSocket2.disconnect();
    })
    
    clientSocket2.on(Event.ERROR_JOINING, () => {
      console.log('Error al unirse al juego')
    })
  }
    
});
