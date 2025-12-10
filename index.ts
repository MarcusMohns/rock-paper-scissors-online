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

const clientDist = path.join(__dirname, "../client/dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  // Use a regex route to avoid issues with path-to-regexp parsing of '*' in
  // some environments. The regex matches any path and serves the SPA entry.
  app.get(/.*/, (req, res) => {
    if (req.url === "robots.txt") {
      res.sendFile(path.join(clientDist, "robots.txt"));
    }
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
