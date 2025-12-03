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
    setGame(gameData);
  }, []);

  const handleSetGameState = useCallback((gameState: GameStateType) => {
    setGame((prevGame) => ({
      ...prevGame,
      state: gameState,
    }));
  }, []);

  const updatePlayers = useCallback(() => {
    // Fetch players from socket.io and update gamestate
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
      // Prompt socket.io to reset socketio state and emit 'gameReset' when successful
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
      // Accept Game.state and use this to update game state and user stats
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
      const oldGame = { ...game, state: gameState };
      const finalGame = calculateFinalState(outcome, oldGame, user);
      if (finalGame) {
        handleSetGame(finalGame);
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
      // Spectators are not in socket.io's game 'room' so they will be served the latest game state manually on roundEnd
      if (inGame) {
        // Is a player
        return;
      } else {
        // Is a spectator
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
      // When opponent concede - end game
      handleEndGame("win", gameState);
    },
    [storeStatsToLocalStorage, handleEndGame]
  );

  const onGameLeft = useCallback(async () => {
    // Update players - if we're in a game and one of the players has left then win
    updatePlayers();
    if (game.state.status === "playing") {
      // If we're playing and one of the players has left
      if (inGame) {
        // If we are the remaining player - win.
        handleEndGame("win", game.state);
        // Error handleing TODO
      }
    }
  }, [updatePlayers, game, inGame, handleEndGame]);

  const onGameJoined = useCallback(() => {
    // Reset the game when someone joins it
    handleResetGame(gameName);
  }, [gameName, handleResetGame]);

  useEffect(() => {
    // Fetch players when the component mounts
    updatePlayers();
  }, [user, updatePlayers]);

  const onConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    // If we're not in a game and disconnect - forfeit
    if (inGame) {
      handleEndGame("loss", game.state);
    }
  }, [inGame, handleEndGame, game.state]);

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
    onOpponentConcede,
    onGameJoined,
    onGameLeft,
    handleSetGame,
    handleRoundEndForSpectators,
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
