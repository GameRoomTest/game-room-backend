import { createServer } from "node:http";
import { io as ioc} from "socket.io-client";
import { PORT } from "./constants";
import { Event, Room } from "./socket/tateti/types";

const httpServer = createServer();

httpServer.listen(() => {
  const clientSocket = ioc(`http://localhost:${PORT}`);
  
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
    const clientSocket2 = ioc(`http://localhost:${PORT}`);
    
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

    })
    
    clientSocket2.on(Event.ERROR_JOINING, () => {
      console.log('Error al unirse al juego')
    })

    clientSocket2.emit(Event.MOVE,{position: 0, playerId:joinGameData.id});
    clientSocket2.emit(Event.MOVE,{position: 1, playerId:joinGameData.id});
    clientSocket2.emit(Event.MOVE,{position: 2, playerId:joinGameData.id});
    
    clientSocket2.on(Event.WINNER, (data) => {
      console.log('player2', data)
    })
  }
  clientSocket.on(Event.WINNER, (data)=> {
    console.log('player1', data)
  })
});
