import { createServer } from "node:http";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { PORT } from "./constants";

const httpServer = createServer();
let clientSocket: ClientSocket;

httpServer.listen(() => {
  clientSocket = ioc(`http://localhost:${PORT}`);

  clientSocket.on("connect", () => {
    console.log('I am a client');
  });

  clientSocket.emit('message', {foo: 123})
});
