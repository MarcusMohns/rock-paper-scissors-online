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
  socket.join("lobby");
  const rooms = io.of("/").adapter.rooms;
  const roomNames = rooms.keys();

  socket.on("connected", async (user, callback) => {
    socket.data.user = user;
    io.emit("setUser", {
      name: user.name,
      id: user.id,
    });

    await updateUserList("lobby");
  });

  socket.on("disconnect", () => {
    // updateLobby();
    // updateUserList("lobby");
  });

  const leaveAllRooms = () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // each socket is in a private room named by the socket id so leave all rooms that isnt that one
        socket.leave(room);
      }
    });
  };

  const updateLobby = async () => {
    const connectedSockets = await io.fetchSockets();
    const socketsArray = Array.from(connectedSockets).map(
      (socket) => socket.id
    );

    const updatedRooms: Promise<RoomType>[] = Array.from(roomNames)
      .filter((value) => !socketsArray.includes(value) && value !== "lobby")
      // Slice the userRooms that are joined by default by socket.io client
      // to facilitate private messaging
      .map(async (value) => {
        const users = await fetchUsersInRoom(value);
        return { name: value, users: users };
      });
    const lobby: LobbyStateType = {
      rooms: await Promise.all(updatedRooms),
    };

    io.emit("updateLobby", lobby);
  };
  const updateUserList = async (roomName: string) => {
    const users = await fetchUsersInRoom(roomName);
    io.emit("updateUserList", users);
  };

  socket.on("fetchUsersInRoom", async (roomName, callback) => {
    callback(await fetchUsersInRoom(roomName));
  });

  const fetchUsersInRoom = async (roomName: string) => {
    const sockets = await io.in(roomName).fetchSockets();
    const users = sockets.map((socket) => socket.data.user);
    return users;
  };

  socket.on("createRoom", async (roomName, callback) => {
    leaveAllRooms();
    // if (rooms.has(roomName)) {
    //   console.log(`Room ${roomName} already exists.`);
    //   io.emit("response", `Room ${roomName} already exists.`);
    //   // This needs to prompt user to change room name!
    //   return;
    // }
    socket.join(roomName);
    updateLobby();
    updateUserList(roomName);
    updateUserList("lobby");
  });

  socket.on("joinRoom", (roomName, callback) => {
    leaveAllRooms();
    socket.join(roomName);
    updateLobby();
    updateUserList(roomName);
    updateUserList("lobby");
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
