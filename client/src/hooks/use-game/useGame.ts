import { useCallback, useState, useEffect, useContext } from "react";
import { useError } from "../useError";
import type {
  GameStateType,
  PlayersResponseType,
  GameType,
  SetSocketDataResponse,
} from "../../types";
import { socket, gamesSocket } from "../../socketio/socket";
import { concede, calculateFinalState, initialGame } from "./store";
import { UserContext } from "../../Context";

type Props = {
  gameName: string;
  inGame: boolean;
};

export const useGame = ({ gameName, inGame }: Props) => {
  const { user, storeStatsToLocalStorage } = useContext(UserContext);
  const { error, handleSetError } = useError();
  const [game, setGame] = useState({ ...initialGame(3) });
  const [isConnected, setIsConnected] = useState<boolean>(
    gamesSocket.connected
  );

  const handleSetGame = useCallback((gameData: GameType) => {
    console.log("Setting game in useGame hook", gameData);
    setGame(gameData);
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
      storeStatsToLocalStorage,
      handleSetGameState,
      handleSetError
    );
  }, [
    gameName,
    game,
    user,
    storeStatsToLocalStorage,
    handleSetGameState,
    handleSetError,
  ]);

  const handleEndGame = useCallback(
    (outcome: "win" | "loss" | "draw", gameState: GameStateType) => {
      console.log("Ending game with outcome:", outcome, gameState);
      if (!user) {
        handleSetError({ status: true, message: "User not found" });
        return;
      }
      if (outcome === "draw") {
        handleSetError({
          status: true,
          message: "Error - draw is not a valid outcome",
        });
        return;
      }
      const oldGameState = { ...game, state: gameState };
      // Todo rename maybe
      const finalGameState = calculateFinalState(outcome, oldGameState, user);
      if (finalGameState) {
        handleSetGame(finalGameState);
        storeStatsToLocalStorage(outcome);
      } else {
        handleSetError({
          status: true,
          message: "Error - Something went wrong ending the game",
        });
      }
    },

    [handleSetGame, storeStatsToLocalStorage, user, handleSetError, game]
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
      storeStatsToLocalStorage("win");
    },
    [storeStatsToLocalStorage, handleSetGameState]
  );

  const onGameLeft = useCallback(async () => {
    // Update players component when a player leaves
    updatePlayers();
  }, [updatePlayers]);

  const onGameJoined = useCallback(() => {
    console.log("Game joined - updating players");
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
      handleEndGame("loss", game.state);
    }
  }, [inGame, storeStatsToLocalStorage, handleEndGame, user, game]);

  useEffect(() => {
    // fetch players when the component mounts
    updatePlayers();
  }, [user, updatePlayers]);

  useEffect(() => {
    if (game.state.status === "playing") {
      // If we're playing and one of the players has left
      if (game.players.player1 === null || game.players.player2 === null) {
        if (inGame) {
          // If we are the remaining player - win.
          handleEndGame("win", game.state);
        } else {
          // Error handleing TODO
        }
      }
    }
  }, [game, inGame, handleEndGame, storeStatsToLocalStorage]);

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
    handleEndGame,
    isConnected,
  };
};
