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
  // const rooms = io.of("/").adapter.rooms;
  // const roomNames = rooms.keys();

  socket.on("connected", async (user, callback) => {
    socket.data.user = user;
    callback({ ...user, socketId: socket.id });
    // Return socket id to client - we'll use this to send private messages.

    await updateUserList("lobby");
    await updateLobby();
  });

  socket.on("setUser", async (user, room, callback) => {
    socket.data.user = user;
    await updateUserList(room);
    await updateLobby();
    callback(user);

    // await updateUserList(roomName); when we get access to roomName somehow
  });

  socket.on("disconnect", async () => {
    await updateUserList("lobby");
    await updateLobby();
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
    const rooms = io.of("/").adapter.rooms;
    const roomNames = rooms.keys();

    const connectedSockets = await io.fetchSockets();
    const socketsArray = Array.from(connectedSockets).map(
      (socket) => socket.id
    );

    const updatedRooms: Promise<RoomType>[] = Array.from(roomNames)
      .filter((value) => !socketsArray.includes(value) && value !== "lobby")
      // Filter out the main lobby and rooms with the sockets.id (those are default rooms created by socket.io for private messsages)
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
    if (roomName === "lobby") {
      io.emit("updateLobbyUserList", users);
    } else {
      console.log("this is never reached or whats up...?");
      io.to(roomName).emit("updateRoomUserList", users);
      // io.emit("updateRoomUserList", users);
    }
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
    callback(roomName);
    await socket.join(roomName);

    await updateLobby();
    await updateUserList(roomName);
  });

  socket.on("joinRoom", async (roomName, callback) => {
    leaveAllRooms();
    callback(roomName);
    await socket.join(roomName);

    await updateLobby();
    await updateUserList(roomName);
  });

  socket.on("chatMessage", (msg, callback) => {
    try {
      io.to(msg.room).emit("chatMessage", msg);
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
