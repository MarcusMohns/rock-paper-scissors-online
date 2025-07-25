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
  UserType,
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

  const updateLobby = async () => {
    const socketCount = io.of("/").sockets.size;

    const updatedRooms: Promise<RoomType>[] = Array.from(roomNames)
      .slice(socketCount)
      // Slice the userRooms that are joined by default by socket.io client
      // to facilitate private messaging
      .map(async (value) => {
        const sockets = await fetchSocketsInRoom(value);
        const users = sockets.map((socket) => socket.data.user);
        return { name: value, users: users };
      });
    const lobby: LobbyStateType = {
      rooms: await Promise.all(updatedRooms),
    };

    io.emit("updateLobby", lobby);
  };
  socket.on("setUser", (user, callback) => {
    socket.data.user = user;

    io.emit("setUser", {
      name: user.name,
      id: user.id,
    });
  });

  socket.on("fetchUsersInRoom", async (roomName, callback) => {
    const sockets = await fetchSocketsInRoom(roomName);
    const users = sockets.map((socket) => socket.data.user);
    callback(users);
  });

  const fetchSocketsInRoom = async (roomName: string) => {
    const sockets =
      roomName === "lobby"
        ? await io.fetchSockets()
        : await io.in(roomName).fetchSockets();

    return sockets;
  };

  socket.on("createRoom", (roomName, callback) => {
    leaveAllRooms();
    if (rooms.has(roomName)) {
      console.log(`Room ${roomName} already exists.`);
      io.emit("response", `Room ${roomName} already exists.`);
      // This needs to prompt user to change room name!
      return;
    }
    socket.join(roomName);
    updateLobby();
  });

  socket.on("joinRoom", (roomName, callback) => {
    leaveAllRooms();
    socket.join(roomName);
    updateLobby();
  });

  socket.on("leaveAllRooms", () => {
    leaveAllRooms();
    updateLobby();
  });

  socket.on("lobbyChat", (msg, callback) => {
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
