import express, { response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
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
  connectionStateRecovery: {},
  cors: {
    origin: "http://localhost:5173",
  },
});
io.of("/").adapter.on("create-room", (room) => {
  console.log(`room ${room} was created`);
  // io.to(room).emit("roomJoined", room);
  // Restarting using this as jump off point. -> this emits that room has been created, so on client side it should emit updateLobby and
  // use the return value from that to update the state
});

io.of("/").adapter.on("join-room", async (room, id) => {
  io.to(room).emit("roomJoined", room);
  console.log(`socket ${id} has joined room ${room}`);
  // Yep same here, joins a room , its emitted to the room that someone is joined, emit updateRoom and use the return value from that to update the state
});

io.of("/").adapter.on("leave-room", (room, id) => {
  io.emit("roomLeft", room);
  console.log(`socket ${id} has left room ${room}`);
});

io.on("connection", async (socket) => {
  socket.on("connected", async (user, callback) => {
    socket.data.user = user;
    callback({ ...user, socketId: socket.id });
    // Return socket id to client - we'll use this to send private messages.
  });

  socket.on("setUser", async (user, callback) => {
    socket.data.user = user;
    io.emit("updateUser", user);
    callback(user);
  });

  const filterRooms = async (connectedSockets: any[]) => {
    // Filter out the main lobby and rooms with the sockets.id (those are default rooms created by socket.io for private messsages)

    const rooms = io.of("/").adapter.rooms;
    const roomNames = rooms.keys();
    const socketsArray = Array.from(connectedSockets).map(
      (socket) => socket.id
    );
    const filteredSockets = Array.from(roomNames).filter(
      (value) => !socketsArray.includes(value) && value !== "lobby"
    );

    return filteredSockets;
  };

  const fetchRoomsInLobby = async () => {
    const connectedSockets = await io.fetchSockets();
    const filteredRooms = await filterRooms(connectedSockets);

    const updatedRooms = filteredRooms.map(async (value) => {
      const users = await fetchUsersInRoom(value);
      return { name: value, users: users };
    });

    const roomsInLobby = await Promise.all(updatedRooms);

    return roomsInLobby;
  };

  socket.on("fetchRoomsInLobby", async (callback) => {
    const lobby = await fetchRoomsInLobby();
    callback(lobby);
  });

  const fetchUsersInRoom = async (roomName: string) => {
    const sockets = await io.in(roomName).fetchSockets();
    const users = sockets.map((socket) => socket.data.user);
    return users;
  };
  socket.on("fetchUsersInRoom", async (roomName, callback) => {
    const usersInRoom = await fetchUsersInRoom(roomName);
    callback(usersInRoom);
  });

  // socket.on("disconnect", async () => {

  // });

  const leaveAllRooms = async () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // each socket is in a private room named by the socket id so leave all rooms that isnt that one
        socket.leave(room);
      }
    });
  };

  socket.on("createRoom", async (roomName, callback) => {
    await leaveAllRooms();
    // if (rooms.has(roomName)) {
    //   console.log(`Room ${roomName} already exists.`);
    //   io.emit("response", `Room ${roomName} already exists.`);
    //   // This needs to prompt user to change room name!
    //   return;
    // }

    await socket.join(roomName);
    const UsersInRoom = await fetchUsersInRoom(roomName);
    callback(roomName, UsersInRoom);
  });

  socket.on("joinRoom", async (roomName, callback) => {
    await leaveAllRooms();
    await socket.join(roomName);
    const UsersInRoom = await fetchUsersInRoom(roomName);
    callback(roomName, UsersInRoom);
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
