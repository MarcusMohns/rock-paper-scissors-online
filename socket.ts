import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  UserType,
  GameStateType,
  SetSocketGameStateResponse,
} from "./types";
import { gameData, defaultGameState, startedGameState } from "./store";

const ROOM_CAPACITY = 10;
const GAME_CAPACITY = 2;

// MAIN NAMESPACE
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
    socket.on("connected", async (user, callback) => {
      // socket emits "connected" event with user data when 'App' renders
      const sockets = await io.fetchSockets();
      const isAlreadyConnected = sockets.find((s) => {
        // If a socket is connected with the user id (i.e. the user is already connected)
        return s.data.user && s.data.user.id === user.id && s.id !== socket.id;
      });

      // Save user data in socket.data
      socket.data.user = { ...user, socketId: socket.id };

      if (isAlreadyConnected) {
        // Disconnect the older socket
        isAlreadyConnected.disconnect();
        callback({
          type: "error",
          data: {
            status: true,
            message:
              "Old connection disconnected. A new connection has been established. ",
          },
        });
      } else {
        // If we're not already connected proceed as normal
        callback({
          type: "ok",
          data: { ...user, socketId: socket.id },
        });
      }
    });

    socket.on("setUser", (user, callback) => {
      // Called when user data is updated
      socket.data.user = user;
      io.emit("updateUser", user);
      callback(user);
    });
    socket.on("fetchUsersInRoom", async (roomName, callback) => {
      const usersInRoom = await fetchUsersInRoom(roomName);
      callback(usersInRoom);
    });

    socket.on("fetchRoomsInLobby", async (callback) => {
      const lobby = await fetchRoomsInLobby();
      callback(lobby);
    });

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
        // Check if room is at capacity (excluding lobby which has no set capacity)
        callback({ roomName: roomName, status: "Room is full" });
        return;
      }
      await leaveAllRooms();
      await socket.join(roomName);
      callback({ roomName: roomName, status: "ok" });
    });

    socket.on("leaveAllRooms", () => {
      leaveAllRooms();
    });

    socket.on("chatMessage", (msg, callback) => {
      try {
        io.to(msg.room).emit("chatMessage", msg);
        callback({ status: "ok" });
      } catch (error) {
        callback({ status: "error" });
      }
    });

    // HELPER FUNCTIONS
    const fetchRoomsInLobby = async () => {
      // Return all the rooms that are not socketID rooms & not the 'lobby' room
      // Also return the users in those rooms
      const connectedSockets = await io.fetchSockets();
      const filteredRooms = await filterRooms(connectedSockets);

      const updatedRooms = filteredRooms.map(async (value) => {
        const users = await fetchUsersInRoom(value);
        return { name: value, users: users };
      });

      const roomsInLobby = await Promise.all(updatedRooms);

      return roomsInLobby;
    };

    const filterRooms = async (connectedSockets: any[]) => {
      // Filter out socketID rooms & the 'lobby' room
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

    const fetchUsersInRoom = async (roomName: string) => {
      const sockets = await io.in(roomName).fetchSockets();
      const users = sockets.map((socket) => socket.data.user);
      return users;
    };
    const leaveAllRooms = async () => {
      // Leave all rooms minus the personal message room assigned to the user automatically with the same name as socketid
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    };
  });
}

// GAME NAMESPACE
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
    // When a player joins a game room
    io.to(room).emit("gameJoined", room);
    // Emit to the room on the main namespace (not the games namespace) that a player has joined
    // This is used to update everyone in the room (players and spectators)
  });

  gamesNamespace.adapter.on("leave-room", (room, id) => {
    // When a player leaves a game room
    io.to(room).emit("gameLeft", room);
    // Emit to the room on the main namespace (not the games namespace) that a player has left
    // This is used to update everyone in the room (players and spectators)
    io.to(room).emit("cancelCountdown");
  });

  gamesNamespace.on("connection", (socket) => {
    socket.on("connected", async (user) => {
      // User sends their user data & we save it in socket.data
      socket.data.user = user;

      const sockets = await gamesNamespace.fetchSockets();
      const isAlreadyConnected = sockets.find((s) => {
        // If a socket with the same user ID exists and it's not this socket
        return s.data.user && s.data.user.id === user.id && s.id !== socket.id;
      });
      // If a socket with the same user ID exists and it's not this socket then disconnect it
      isAlreadyConnected ? isAlreadyConnected.disconnect() : null;
    });

    // Game logic events

    socket.on("createOrJoinGame", async (gameName: string, callback) => {
      const playersResponse = await fetchPlayersInGame(gameName);
      if (playersResponse === "error fetching players") {
        callback({ status: playersResponse });
        return;
      }
      // Check if player1 & player2 are in the game - if both are present the game is full
      const gameIsFull = playersResponse.player1 && playersResponse.player2;

      if (!gameIsFull) {
        // If game has space join the game (socket.join will create the room if it doesn't exist)
        await leaveAllGames();
        await socket.join(gameName);
        callback({ status: "ok" });
      } else {
        callback({ status: "Game full" });
      }
    });

    socket.on("startGameCountdown", async (gameName, callback) => {
      // Start the game countdown for both players
      const playersResponse = await fetchPlayersInGame(gameName);
      if (playersResponse === "error fetching players") {
        callback({ status: playersResponse });
        return;
      }
      const bothPlayersConnected =
        playersResponse.player1 && playersResponse.player2;

      if (bothPlayersConnected) {
        socket.to(gameName).emit("startCountdown");
        callback({ status: "ok" });
      } else {
        callback({ status: "Missing players" });
      }
    });

    socket.on("setUser", (user) => {
      // Called when user data is updated
      socket.data.user = user;
    });

    socket.on("cancelGameCountdown", async (gameName) => {
      io.to(gameName).emit("cancelCountdown");
    });

    socket.on("startGame", async (gameName, callback) => {
      // called at the end of the starting game countdown for both players
      const gameStateResponse = await setSocketGameState(
        gameName,
        startedGameState(3)
      );
      if (gameStateResponse.status === "ok") {
        callback({
          status: "ok",
          gameState: gameStateResponse.gameState,
        });
        // Annunce to the game room that this player is ready
        socket.to(gameName).emit("opponentReady");
      } else {
        callback({ status: "error", gameState: null });
      }
    });

    socket.on("resetGame", async (gameName, callback) => {
      // Pressing the reset button will only reset the `socket.data.game` for the user who presses the button.
      // It will also emit a signal to reset the local state for both players, but the other players' `socket.data.game` will remain unchanged
      // socket.data.game will reset for both on start of games or when a player leaves / joins the game.
      const gameStateResponse = await setSocketGameState(
        gameName,
        defaultGameState(3)
      );
      if (gameStateResponse.status === "ok") {
        // callback({ status: "ok", game: gameStateResponse.game });
        io.to(gameName).emit("gameReset", gameStateResponse.game);
      } else {
        callback({ status: "error", game: null });
      }
    });

    socket.on("concede", async (gameName, concededGameState, callback) => {
      if (
        // Game exists and both players are present
        socket.data.game &&
        socket.data.game.players.player1 &&
        socket.data.game.players.player2
      ) {
        const gameStateResponse = await setSocketGameState(
          gameName,
          concededGameState
        );
        if (gameStateResponse.status === "ok" && gameStateResponse.gameState) {
          // Socket data has been updated
          callback({ status: "ok", gameState: gameStateResponse.gameState });
          socket
            .to(gameName)
            .emit("opponentConceded", gameStateResponse.gameState);
        } else {
          callback({ status: gameStateResponse.status, gameState: null });
        }
      } else {
        callback({ status: "error - game does not exist", gameState: null });
      }
    });

    socket.on(
      "submitChoice",
      async (gameName, selected, userRoundsState, user, callback) => {
        // Called when a player makes a move and updates both players individual states.
        if (!GameIsRunning(gameName) || !socket.data.game) {
          // Game hasn't started
          callback({ status: "Game not running", updatedRounds: null });
          return;
        }
        if (!selected || !userRoundsState) {
          callback({ status: "No move registered", updatedRounds: null });
          return;
        }

        // Get current round from socket data which will be updated by either startGame or endRound call.
        let { currRound } = socket.data.game.state;

        // Get current round and rounds[] from the users game state
        const rounds = [...userRoundsState];
        const round = rounds[currRound - 1];

        const isPlayer1 = getIsPlayer1(user);

        // Update rounds with the players choice in the current round
        const updatedRounds = [...rounds];
        updatedRounds[currRound - 1] = {
          ...round,
          // Update correct player choice
          [isPlayer1 ? "player1Choice" : "player2Choice"]: selected,
        };

        // Respond with updated rounds to self and opponent
        callback({ status: "ok", updatedRounds: updatedRounds });
        socket.to(gameName).emit("opponentChoice", updatedRounds);
      }
    );

    socket.on("endRound", async (gameName, updatedGameState, callback) => {
      const gameStateResponse = await setSocketGameState(
        gameName,
        updatedGameState
      );
      if (gameStateResponse.status === "ok" && gameStateResponse.gameState) {
        callback({
          status: "ok",
          gameState: gameStateResponse.gameState,
        });
        if (gameStateResponse.gameState.status === "playing") {
          // Annunce to the game room that this player is ready
          socket.to(gameName).emit("opponentReady");

          io.to(gameName).emit(
            "roundEndedForSpectators",
            gameStateResponse.gameState
          );
        } else if (gameStateResponse.gameState.status === "finished") {
          io.to(gameName).emit(
            "roundEndedForSpectators",
            gameStateResponse.gameState
          );
        }
      } else {
        callback({ status: "error", gameState: null });
      }
    });

    socket.on("leaveAllGames", async (gameName) => {
      await leaveAllGames();
    });

    socket.on("fetchPlayers", async (gameName, callback) => {
      const response = await fetchPlayersInGame(gameName);
      if (response === "error fetching players") {
        callback({ status: response, players: null });
      } else {
        callback({ status: "ok", players: response });
      }
    });

    // HERLPER FUNCTIONS FOR GAME NAMESPACE
    const setSocketGameState = async (
      gameName: string,
      state: GameStateType
    ): Promise<SetSocketGameStateResponse> => {
      const newState = { ...state };
      // Create and set the complete socket.data.game object with the provided state
      try {
        const players = await fetchPlayersInGame(gameName);
        if (players === "error fetching players") {
          return { status: "error", game: null, gameState: null };
        }
        const socketGameData = gameData({
          gameName: gameName,
          players: players,
          state: newState,
          totalRounds: 3,
        });
        socket.data.game = { ...socketGameData };
        return {
          status: "ok",
          game: socketGameData,
          gameState: socketGameData.state,
        };
      } catch (error) {
        return { status: "error", game: null, gameState: null };
      }
    };

    const GameIsRunning = (gameName: string) =>
      socket.data.game &&
      socket.data.game.state.status === "playing" &&
      socket.data.game.name === gameName
        ? true
        : false;

    const leaveAllGames = async () => {
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });
    };

    const fetchPlayersInGame = async (gameName: string) => {
      try {
        const sockets = await gamesNamespace.in(gameName).fetchSockets();
        const players = sockets.map((socket) => socket.data.user);
        return {
          player1: players[0] ? players[0] : null,
          player2: players[1] ? players[1] : null,
        };
      } catch (error) {
        return "error fetching players";
      }
    };

    const getIsPlayer1 = (user: UserType) => {
      if (!socket.data.game) {
        return false;
      }
      const player1 = socket.data.game.players.player1;
      if (player1 && player1.id === user.id) {
        return true;
      }
      return false;
    };
  });
}
