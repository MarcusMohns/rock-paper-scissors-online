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

const ROOM_CAPACITY = 2;

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

/// ADAPTER EVENTS
io.of("/").adapter.on("create-room", (room) => {
  // console.log(`room ${room} was created`);
  // io.to(room).emit("roomJoined", room);
});

io.of("/").adapter.on("join-room", async (room, id) => {
  io.to(room).emit("roomJoined", room);
  // console.log(`socket ${id} has joined room ${room}`);
  // Yep same here, joins a room , its emitted to the room that someone is joined, emit updateRoom and use the return value from that to update the state
});

io.of("/").adapter.on("leave-room", (room, id) => {
  io.to(room).emit("roomLeft", room);
  // console.log(`socket ${id} has left room ${room}`);
});
///
io.of("/games").adapter.on("join-room", async (room, id) => {
  console.log("room joined!");
  io.to(room).emit("gameJoined", room);
});

io.of("/games").adapter.on("leave-room", (room, id) => {
  io.to(room).emit("gameLeft", room);
});

// GAMES NAMESPACE
// This is a separate namespace for games, it can be used for game-specific logic and events
const gamesNamespace = io.of("/games");

gamesNamespace.on("connection", (socket) => {
  socket.on("connected", (user) => {
    socket.data.user = user;
  });

  const fetchPlayersInGame = async (roomName: string) => {
    const sockets = await gamesNamespace.in(roomName).fetchSockets();
    const players = sockets.map((socket) => socket.data.user);
    const playersInGame = {
      player1: players[0] ? players[0] : null,
      player2: players[1] ? players[1] : null,
    };
    return playersInGame;
  };
  socket.on("fetchPlayersInGame", async (roomName, callback) => {
    const playersInGame = await fetchPlayersInGame(roomName);
    callback(playersInGame);
  });

  const leaveAllGames = async () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // each socket is in a private room named by the socket id so leave all rooms that isnt that one
        socket.leave(room);
      }
    });
  };

  socket.on("createOrJoinGame", async (gameName: string, callback) => {
    // Review
    const games = io.of("/games").adapter.rooms;
    const playersInGame = await fetchPlayersInGame(gameName);
    const atCapacity = playersInGame.player1 && playersInGame.player2;
    // If the game already exists
    if (games.has(gameName)) {
      // check if the games full
      if (atCapacity) {
        callback({
          players: playersInGame,
          status: "Seat Taken",
        });
        return;
      } else {
        // Join the game
        await leaveAllGames();
        await socket.join(gameName);

        // This shouldtn be necessary we should update it on join or leave room fix
        const playersInGame = await fetchPlayersInGame(gameName);
        callback({ players: playersInGame, status: "ok" });
      }
    } else if (!games.has(gameName)) {
      // Create the game
      await leaveAllGames();
      await socket.join(gameName);

      // This shouldtn be necessary we should update it on join or leave room fix
      const playersInGame = await fetchPlayersInGame(gameName);
      callback({ players: playersInGame, status: "ok" });
    }
  });
});

/// SOCKET EVENTS
io.on("connection", (socket) => {
  socket.on("connected", (user, callback) => {
    socket.data.user = user;
    callback({ ...user, socketId: socket.id });
    // Return socket id to client - we'll use this to send private messages.
  });

  socket.on("setUser", (user, callback) => {
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
    const rooms = io.of("/").adapter.rooms;
    if (rooms.has(roomName)) {
      callback({ roomName: roomName, status: "Room already exists" });
      return;
    }
    await leaveAllRooms();
    await socket.join(roomName);
    callback({ roomName: roomName, status: "ok" });
  });

  socket.on("joinRoom", async (roomName, callback) => {
    const users = await fetchUsersInRoom(roomName);
    if (users.length >= ROOM_CAPACITY && roomName !== "lobby") {
      callback({ roomName: roomName, status: "Room already full" });
      return;
    }
    await leaveAllRooms();
    await socket.join(roomName);
    callback({ roomName: roomName, status: "ok" });
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
