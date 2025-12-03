import type { RoundType, GameStateType, PlayersType } from "../../types";
import { useCallback, useEffect, useState, useContext } from "react";
import { UserContext } from "../../Context.tsx";
import { gamesSocket } from "../../socketio/socket.ts";
import { useError } from "../useError.ts";
import {
  endRound,
  submitChoice,
  calculateGameResults,
  startGame,
} from "./store";

type Props = {
  gameName: string;
  gameState: GameStateType;
  players: PlayersType;
  rounds: RoundType[];
  handleSetGameState: (gameState: GameStateType) => void;
  handleEndGame: (
    outcome: "win" | "loss" | "draw",
    game: GameStateType
  ) => void;
};

export const useGameplay = ({
  gameName,
  gameState,
  players,
  rounds,
  handleSetGameState,
  handleEndGame,
}: Props) => {
  const { user } = useContext(UserContext);
  const { error, handleSetError } = useError();
  const [showIngameCountdown, setShowIngameCountdown] =
    useState<boolean>(false);
  const [playersReady, setPlayersReady] = useState<{
    player1: boolean;
    player2: boolean;
  }>({
    player1: false,
    player2: false,
  });
  const isPlayer1 =
    players.player1 && user.id === players.player1.id ? true : false;
  const { player1, player2 } = calculateGameResults(rounds, players);

  const onOpponentChoice = useCallback(
    // Called when the opponent selects rock paper or scissors
    (rounds: RoundType[]) => {
      handleSetGameState({ ...gameState, rounds: rounds });
    },
    [gameState, handleSetGameState]
  );

  const handleShowIngameCountdown = useCallback((bool: boolean) => {
    setShowIngameCountdown(bool);
  }, []);

  const handleSetPlayerReady = useCallback(() => {
    // Called when this user is ready for the next round
    setPlayersReady((prevPlayersReady) =>
      isPlayer1
        ? { ...prevPlayersReady, player1: true }
        : { ...prevPlayersReady, player2: true }
    );
  }, [isPlayer1]);

  const onOpponentReady = useCallback(() => {
    // Called when the opponent is ready for the next round
    setPlayersReady((prevPlayersReady) =>
      isPlayer1
        ? { ...prevPlayersReady, player2: true }
        : { ...prevPlayersReady, player1: true }
    );
  }, [isPlayer1]);

  const handleStartGame = (gameName: string) => {
    // This is called at the end of the game starting countdown for both users
    startGame(
      gameName,
      handleSetGameState,
      handleSetPlayerReady,
      handleSetError
    );
  };

  const handleEndRound = useCallback(() => {
    // This is called at the end of countdown
    endRound(
      gameName,
      players,
      user.id,
      gameState,
      handleEndGame,
      handleShowIngameCountdown,
      handleSetGameState,
      handleSetPlayerReady,
      handleSetError
    );
  }, [
    gameName,
    players,
    user.id,
    gameState,
    handleEndGame,
    handleShowIngameCountdown,
    handleSetGameState,
    handleSetPlayerReady,
    handleSetError,
  ]);

  const handleSubmitChoice = useCallback(
    (selected: string | null) => {
      // This is called when a player makes a choice
      submitChoice(
        gameState,
        gameName,
        selected,
        user,
        handleSetGameState,
        handleSetError
      );
    },
    [gameState, gameName, user, handleSetGameState, handleSetError]
  );

  useEffect(() => {
    if (playersReady.player1 && playersReady.player2) {
      // If both players are ready for the next round
      const isFirstRound = gameState.history.length === 0;
      //  start the countdown & reset playersReady
      if (isFirstRound) {
        setShowIngameCountdown(true);
      } else {
        setTimeout(() => setShowIngameCountdown(true), 3000);
      }
      setPlayersReady({ player1: false, player2: false });
    }
  }, [playersReady, setShowIngameCountdown, gameState]);

  useEffect(() => {
    // Make sure to reset the countdown when game is finished or reset
    if (gameState.status === "finished" || gameState.status === "waiting") {
      setShowIngameCountdown(false);
    }
  }, [showIngameCountdown, gameState.status]);

  useEffect(() => {
    gamesSocket.on("opponentChoice", onOpponentChoice);
    gamesSocket.on("opponentReady", onOpponentReady);
    return () => {
      gamesSocket.off("opponentChoice", onOpponentChoice);
      gamesSocket.off("opponentReady", onOpponentReady);
    };
  }, [onOpponentChoice, onOpponentReady]);

  return {
    showIngameCountdown,
    player1,
    player2,
    isPlayer1,
    user,
    error,
    handleSetError,
    handleStartGame,
    handleEndRound,
    handleSubmitChoice,
  };
};
