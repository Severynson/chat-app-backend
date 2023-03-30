import { Server } from "http";
import { Http2SecureServer, Http2Server } from "http2";
import SocketIO from "socket.io";

let io: SocketIO.Server | undefined;

interface IOControllerObject {
  init: (
    httpServer: Server,
    options: Partial<SocketIO.ServerOptions>
  ) => SocketIO.Server;
  getIO: () => SocketIO.Server;
}

const ioControllerObject: IOControllerObject = {
  init: (httpServer, options) => {
    io = new SocketIO.Server(httpServer, options);
    return io;
  },
  getIO: () => {
    if (!io) throw new Error("Socket.io not initialized!");
    else return io;
  },
};

export default ioControllerObject;
