import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
  UserType,
  GameStateType,
} from "./types";
import { gameData, defaultGameState, startedGameState } from "./store";

const ROOM_CAPACITY = 10;
const GAME_CAPACITY = 2;

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
    io.to(room).emit("cancelCountdown");
  });

  gamesNamespace.on("connection", (socket) => {
    socket.on("connected", (user) => {
      // User sends their user data & we save it on the socket.data 'session'
      socket.data.user = user;
    });

    // Game logic events

    socket.on("createOrJoinGame", async (gameName: string, callback) => {
      const games = gamesNamespace.adapter.rooms;
      const playersResponse = await fetchPlayersInGame(gameName);
      if (playersResponse === "error fetching players") {
        callback({ status: playersResponse });
        return;
      }
      const atCapacity = playersResponse.player1 && playersResponse.player2;
      if (games.has(gameName)) {
        // If game exists already
        if (atCapacity) {
          // If game is full
          callback({ status: "Game full" });
          return;
        } else {
          // If game has space and exists, join the game
          try {
            await leaveAllGames();
            await socket.join(gameName);
            callback({ status: "ok" });
          } catch (error) {
            callback({ status: "Error joining game" });
            return;
          }
        }
      } else {
        // If game does not exist, create and join the game
        try {
          await leaveAllGames();
          await socket.join(gameName);
          callback({ status: "ok" });
        } catch (error) {
          callback({ status: "Error creating game" });
          return;
        }
      }
    });

    socket.on("startGameCountdown", async (gameName, callback) => {
      const playersResponse = await fetchPlayersInGame(gameName);
      if (playersResponse === "error fetching players") {
        callback({ status: playersResponse });
        return;
      }
      const bothPlayersConnected =
        playersResponse.player1 && playersResponse.player2;

      if (bothPlayersConnected) {
        io.to(gameName).emit("startCountdown");
        // emits to the entire room not just the two gamers
        return;
      } else {
        callback({ status: "Missing players" });
        return;
      }
    });

    socket.on("cancelGameCountdown", async (gameName) => {
      io.to(gameName).emit("cancelCountdown");
    });

    socket.on("startGame", async (gameName, callback) => {
      if (isGameRunning(gameName)) {
        // Dont start the game if it is already running
        callback({ status: "Game already running", game: socket.data.game });
        return;
      }
      if ((await setSocketGameState(gameName, startedGameState)) === "ok") {
        callback({ status: "ok", game: socket.data.game });
        io.to(gameName).emit("gameStarted", socket.data.game);
      } else {
        callback({ status: "error", game: null });
      }
    });

    socket.on("resetGame", async (gameName, callback) => {
      const response = await setSocketGameState(gameName, defaultGameState);
      if (response === "ok") {
        callback({ status: "ok", game: socket.data.game });
        io.to(gameName).emit("gameReset", socket.data.game);
      } else {
        callback({ status: "error", game: null });
      }
    });

    socket.on("loseGame", async (gameName, user, callback) => {
      if (
        // Game exists and both players are present
        socket.data.game &&
        socket.data.game.players.player1 &&
        socket.data.game.players.player2
      ) {
        const winner =
          socket.data.game.players.player1.id === user.id
            ? // If the player who lost is player 1, return player 2
              socket.data.game.players.player2
            : socket.data.game.players.player1;
        const lostGameState: GameStateType = {
          ...socket.data.game.state,
          winner: winner,
          status: "finished",
          combatLog: [
            ...socket.data.game.state.combatLog,
            `${winner.name} won!`,
          ],
        };
        const response = await setSocketGameState(gameName, lostGameState);
        if (response === "ok") {
          // Socket data has been updated
          callback({ status: "ok", game: socket.data.game });
          io.to(gameName).emit("gameLost", socket.data.game);
        } else {
          callback({ status: response, game: null });
        }
      } else {
        console.log("Game does not exist");
      }
    });

    socket.on("endRound", async (gameName, selected, user, callback) => {
      // selected
      if (isGameRunning(gameName) && socket.data.game) {
        const player1 = socket.data.game.players.player1;
        const player2 = socket.data.game.players.player2;

        // check if socket is player1 or player2
        const isPlayer1 = player1 && player1.id === user.id ? true : false;
        const isPlayer2 = player2 && player2.id === user.id ? true : false;

        const roundNum = socket.data.game.state.round;
        if (roundNum > socket.data.game.state.rounds.length) {
          callback({ status: "Round does not exist", game: null });
          // Game should already been ended and reset before this case
          console.log("game finished");
          return;
        }

        // Set socket data to the selected choice
        if (isPlayer1) {
          socket.data.game.state.rounds[roundNum - 1].player1Choice = selected;
        } else if (isPlayer2) {
          socket.data.game.state.rounds[roundNum - 1].player2Choice = selected;
        }

        if (roundNum === socket.data.game.state.rounds.length) {
          // Last round and should end the game
          // socket.data.game.state.status = "finished";
        }

        const winnerOfRound = getWinnerOfRound(roundNum);

        if (!winnerOfRound) {
          // getWinnerofRound returns null if one of the players move havnt been registered yet or socket.data.game doesnt exist.
          // in other words we should prolly separate those two cases and make sure socket.data.game exists before calling getWinnerOfRound
          // prolly
          return;
        }

        const updatedRound = {
          player1Choice: isPlayer1 ? selected : null,
          player2Choice: isPlayer2 ? selected : null,
          winner: winnerOfRound,
        };

        const newGameState = {
          ...socket.data.game.state,
          round: roundNum + 1,
          rounds: [
            ...socket.data.game.state.rounds,
            (socket.data.game.state.rounds[roundNum - 1] = updatedRound),
          ],
          winner: null,
          combatLog: [
            ...socket.data.game.state.combatLog,
            `${user.name} chose ${selected}`,
          ],
        };

        const response = await setSocketGameState(gameName, newGameState);
        if (response === "ok") {
          callback({ status: "ok", game: socket.data.game });
          io.to(gameName).emit("roundEnded", socket.data.game);
        } else {
          callback({ status: response, game: null });
        }
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

    // Helper functions for game namespace
    const setSocketGameState = async (
      gameName: string,
      state: GameStateType
    ) => {
      // Create and set the complete socket.data.game object with the provided state
      try {
        const players = await fetchPlayersInGame(gameName);
        if (players === "error fetching players") {
          return players;
        }
        const socketGameData = gameData({ gameName, players, state });
        socket.data.game = socketGameData;
        return "ok";
      } catch (error) {
        return "error setting socket.data.game";
      }
    };

    const getWinnerOfRound = (round: number): UserType | null | "draw" => {
      if (socket.data.game) {
        const player1Choice =
          socket.data.game.state.rounds[round].player1Choice;
        const player2Choice =
          socket.data.game.state.rounds[round].player2Choice;
        if (player2Choice === null || player1Choice === null) {
          return null;
        }

        if (player1Choice === player2Choice) {
          return "draw";
        } else if (player1Choice === "none") {
          return socket.data.game.players.player2;
        } else if (player2Choice === "none") {
          return socket.data.game.players.player1;
        } else if (
          (player1Choice === "rock" && player2Choice === "scissors") ||
          (player1Choice === "paper" && player2Choice === "rock") ||
          (player1Choice === "scissors" && player2Choice === "paper")
        ) {
          return socket.data.game.players.player1;
        } else {
          return socket.data.game.players.player2;
        }
      } else {
        return null;
      }
    };

    const isGameRunning = (gameName: string) =>
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
  });
}
