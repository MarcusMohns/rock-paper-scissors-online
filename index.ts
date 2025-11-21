import express from "express";
import path from "path";
import { createServer } from "http";
import { Server, ServerOptions } from "socket.io";
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

// When you add your React app to this repository, place it in `client/`.
// Production build output should go to `client/dist` (Vite default).
const clientDist = path.join(__dirname, "../client/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const httpServer = createServer(app);

const ioOptions: Partial<ServerOptions> = {
  connectionStateRecovery: {},
};

// Allow Vite dev server to connect when running locally (not production).
// Sometimes `NODE_ENV` isn't set to "development" by the runtime used
// by `tsx`, so check for non-production instead of strict equality.
if (process.env.NODE_ENV !== "production") {
  ioOptions.cors = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  };
}

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, ioOptions as ServerOptions);

registerSocketHandlers(io);
registerGameNamespaceHandlers(io);

const PORT = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`);
});
