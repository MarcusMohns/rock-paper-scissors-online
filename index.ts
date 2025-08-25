import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./types";
import {
  registerSocketHandlers,
  registerGameNamespaceHandlers,
} from "./socket";

const app = express();
const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
  },
});

registerSocketHandlers(io);
registerGameNamespaceHandlers(io);

httpServer.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
