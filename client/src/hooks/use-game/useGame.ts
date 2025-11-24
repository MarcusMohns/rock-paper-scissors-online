import { useCallback, useState, useEffect, useContext } from "react";
import { useError } from "../useError";
import type {
  GameStateType,
  PlayersResponseType,
  GameType,
  UserType,
  SetSocketDataResponse,
} from "../../types";
import { socket, gamesSocket } from "../../socketio/socket";
import { UserContext } from "../../Context";
import { concede, winGame, loseGame, initialGame } from "./store";

type Props = {
  gameName: string;
  inGame: boolean;
};

export const useGame = ({ gameName, inGame }: Props) => {
  const { user, updateGameStats } = useContext(UserContext);
  const { error, handleSetError } = useError();
  const [game, setGame] = useState({ ...initialGame(3) });
  const [isConnected, setIsConnected] = useState<boolean>(
    gamesSocket.connected
  );

  const handleSetGame = useCallback((game: GameType) => {
    setGame(game);
  }, []);

  const handleSetGameState = useCallback((gameState: GameStateType) => {
    setGame((prevGame) => ({
      ...prevGame,
      state: gameState,
    }));
  }, []);

  const updatePlayers = useCallback(() => {
    gamesSocket.emit(
      "fetchPlayers",
      gameName,
      (response: PlayersResponseType) => {
        if (response.status === "ok") {
          setGame((prevGame) => ({
            ...prevGame,
            players: response.players,
          }));
        } else {
          handleSetError({ status: true, message: response.status });
        }
      }
    );
  }, [gameName, handleSetError]);

  const handleResetGame = useCallback(
    (gameName: string) => {
      gamesSocket.emit(
        "resetGame",
        gameName,
        (response: SetSocketDataResponse) => {
          if (response.status === "ok") {
            console.log("Game reset!");
          } else {
            handleSetError({ status: true, message: response.status });
          }
        }
      );
    },
    [handleSetError]
  );

  const handleConcede = useCallback(() => {
    concede(
      gameName,
      user,
      game,
      updateGameStats,
      handleSetGameState,
      handleSetError
    );
  }, [
    gameName,
    game,
    user,
    updateGameStats,
    handleSetGameState,
    handleSetError,
  ]);

  const handleWinGame = useCallback(() => {
    winGame(game.state, handleSetGameState, user);
  }, [game.state, handleSetGameState, user]);

  const handleLoseGame = useCallback(
    (user: UserType | null) => {
      if (!user) {
        console.error("handleLoseGame: user is null");
        return;
      }
      loseGame(game.state, handleSetGameState, user);
    },
    [game.state, handleSetGameState]
  );

  const handleRoundEndForSpectators = useCallback(
    (gameState: GameStateType) => {
      // Spectators aren't in socketIOs game 'room' so they will be served the latest game state manually on roundEnd.
      if (inGame) {
        // Player
        return;
      } else {
        // Spectator
        setGame((prevGame) => ({
          ...prevGame,
          state: gameState,
        }));
      }
    },
    [inGame]
  );

  const onOpponentConcede = useCallback(
    (gameState: GameStateType) => {
      // Update user stats when opponent gives up
      handleSetGameState(gameState);
      updateGameStats("win");
    },
    [updateGameStats, handleSetGameState]
  );

  const onGameLeft = useCallback(async () => {
    // Update players component when a player leaves
    updatePlayers();
  }, [updatePlayers]);

  const onGameJoined = useCallback(() => {
    // Remove and replace with connect?
    handleResetGame(gameName);
  }, [gameName, handleResetGame]);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    // If we're in a game and disconnect we forfeit the game.
    if (inGame) {
      const otherPlayer =
        game.players.player1 && game.players.player1.id === user.id
          ? game.players.player2
          : game.players.player1;
      handleLoseGame(otherPlayer);
      updateGameStats("loss");
    }
  }, [inGame, updateGameStats, handleLoseGame, user, game]);

  useEffect(() => {
    // Connect to the game socket & fetch players when the component mounts
    gamesSocket.emit("connected", user);
    console.log("Emitted connected with user:", user);
    updatePlayers();
  }, [user, updatePlayers]);

  useEffect(() => {
    if (game.state.status === "playing") {
      // If we're playing and one of the players has left
      if (game.players.player1 === null || game.players.player2 === null) {
        if (inGame) {
          // If we are the remaining player - win.
          handleWinGame();
          updateGameStats("win");
        } else {
          // Error handleing TODO
        }
      }
    }
  }, [game, inGame, handleWinGame, handleLoseGame, updateGameStats]);

  useEffect(() => {
    if (gamesSocket.connected) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Updates state whenever a user joins/leaves
    gamesSocket.on("connect", onConnect);
    gamesSocket.on("disconnect", onDisconnect);
    gamesSocket.on("opponentConceded", onOpponentConcede);
    socket.on("gameJoined", onGameJoined);
    socket.on("gameLeft", onGameLeft);
    socket.on("gameReset", handleSetGame);
    socket.on("roundEndedForSpectators", handleRoundEndForSpectators);

    return () => {
      gamesSocket.off("connect", onConnect);
      gamesSocket.off("disconnect", onDisconnect);
      gamesSocket.off("opponentConceded", onOpponentConcede);
      socket.off("gameJoined", onGameJoined);
      socket.off("gameLeft", onGameLeft);
      socket.off("gameReset", handleSetGame);
      socket.off("roundEndedForSpectators", handleRoundEndForSpectators);
    };
  }, [
    onConnect,
    onDisconnect,
    onGameJoined,
    onGameLeft,
    handleSetGame,
    handleRoundEndForSpectators,
    onOpponentConcede,
  ]);

  return {
    game,
    user,
    error,
    handleSetError,
    handleConcede,
    handleSetGameState,
    isConnected,
  };
};
