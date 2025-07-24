import express, { response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  LobbyStateType,
  RoomType,
} from "./types";

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  const rooms = io.of("/").adapter.rooms;
  const roomNames = rooms.keys();

  const leaveAllRooms = () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  };

  const updateLobby = () => {
    const newLobbyState: LobbyStateType = {
      rooms: [],
    };

    rooms.forEach((value, key: string | { name: string }) => {
      const users = Array.from(value);
      if (key === users[0]) return; // Skip first key which is the default room
      newLobbyState.rooms.push({
        name: key,
        users: users,
      });
    });

    io.emit("updateLobby", newLobbyState);
  };

  socket.on("createRoom", (roomName, callback) => {
    leaveAllRooms();
    socket.join(roomName);
    updateLobby();
    console.log(io.sockets.adapter.sids);
  });

  socket.on("joinRoom", (roomName, callback) => {
    leaveAllRooms();
    socket.join(roomName);
    updateLobby();
  });

  socket.on("lobbyChat", (msg, callback) => {
    console.log("Lobby chat message received:", msg);
    try {
      io.emit("lobbyChat", msg);
      callback({
        status: "ok",
      });
    } catch (error) {
      callback({
        status: "error",
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
