import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  UserType,
} from "./types";

const ROOM_CAPACITY = 10;

export function registerSocketHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  io.of("/").adapter.on("join-room", async (room, id) => {
    io.to(room).emit("roomJoined", room);
  });

  io.of("/").adapter.on("leave-room", (room, id) => {
    io.to(room).emit("roomLeft", room);
  });

  io.on("connection", (socket) => {
    socket.on("connected", (user, callback) => {
      socket.data.user = user;
      callback({ ...user, socketId: socket.id });
    });

    socket.on("setUser", (user, callback) => {
      socket.data.user = user;
      io.emit("updateUser", user);
      callback(user);
    });

    const filterRooms = async (connectedSockets: any[]) => {
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

    const leaveAllRooms = async () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
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
        callback({ roomName: roomName, status: "Room is full" });
        return;
      }
      await leaveAllRooms();
      await socket.join(roomName);
      callback({ roomName: roomName, status: "ok" });
    });

    socket.on("chatMessage", (msg, callback) => {
      try {
        io.to(msg.room).emit("chatMessage", msg);
        callback({ status: "ok" });
      } catch (error) {
        callback({ status: "error" });
      }
    });
  });
}

export function registerGameNamespaceHandlers(
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
) {
  const gamesNamespace = io.of("/games");
  // Games are named after the room they are in - The game room is for the two players playing the game only.

  gamesNamespace.adapter.on("join-room", async (room, id) => {
    // Emit to the room on the main namespace (not the games namespace) that a player has joined
    // This is used to update everyone in the room (players and spectators)
    io.to(room).emit("gameJoined", room);
  });

  gamesNamespace.adapter.on("leave-room", (room, id) => {
    // Emit to the room on the main namespace (not the games namespace) that a player has left
    // This is used to update everyone in the room (players and spectators)
    io.to(room).emit("gameLeft", room);
  });

  gamesNamespace.on("connection", (socket) => {
    socket.on("connected", (user) => {
      socket.data.user = user;
    });

    const fetchPlayersInGame = async (roomName: string) => {
      const sockets = await gamesNamespace.in(roomName).fetchSockets();
      const players = sockets.map((socket) => socket.data.user);
      return {
        player1: players[0] ? players[0] : null,
        player2: players[1] ? players[1] : null,
      };
    };

    socket.on("fetchPlayersInGame", async (roomName, callback) => {
      const playersInGame = await fetchPlayersInGame(roomName);
      callback(playersInGame);
    });

    const leaveAllGames = async () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    };

    socket.on("leaveAllGames", async () => {
      await leaveAllGames();
    });

    socket.on("createOrJoinGame", async (gameName: string, callback) => {
      const games = gamesNamespace.adapter.rooms;
      const playersInGame = await fetchPlayersInGame(gameName);
      const atCapacity = playersInGame.player1 && playersInGame.player2;
      if (games.has(gameName)) {
        // If game exists already
        if (atCapacity) {
          // If game is full
          callback({ status: "Game full" });
          return;
        } else {
          // If game has space and exists, join the game
          await leaveAllGames();
          await socket.join(gameName);
          callback({ status: "ok" });
        }
      } else {
        // If game does not exist, create and join the game
        await leaveAllGames();
        await socket.join(gameName);
        callback({ status: "ok" });
      }
    });
  });
}
