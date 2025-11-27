import type {
  ChoiceSubmittedResponseType,
  UserType,
  MoveType,
  EndRoundStateResponseType,
  GameStateResponseType,
  ErrorType,
  RoundType,
  PlayersType,
  GameStateType,
  GameType,
} from "../../types";
import { gamesSocket } from "../../socketio/socket";

export const startGame = (
  gameName: string,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetPlayerReady: () => void,
  handleSetError: (error: ErrorType) => void
) => {
  gamesSocket.emit("startGame", gameName, (response: GameStateResponseType) => {
    if (response.status === "ok" && response.gameState) {
      handleSetGameState(response.gameState);
      // Ready up this players local state
      handleSetPlayerReady();
    } else {
      handleSetError({ status: true, message: response.status });
    }
  });
};

export const submitChoice = (
  gameState: GameStateType,
  gameName: string,
  selected: string | null,
  user: UserType,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetError: (error: ErrorType) => void
) => {
  const localRoundsState =
    gameState.rounds[gameState.currRound - 1].player1Choice ||
    gameState.rounds[gameState.currRound - 1].player2Choice
      ? gameState.rounds
      : null;
  gamesSocket.emit(
    "submitChoice",
    gameName,
    selected,
    localRoundsState,
    user,
    (response: ChoiceSubmittedResponseType) => {
      if (response.status === "ok") {
        handleSetGameState({
          ...gameState,
          rounds: response.updatedRounds,
        });
      } else {
        handleSetError({ status: true, message: response.status });
      }
    }
  );
};

export const gameResults = (rounds: RoundType[], players: PlayersType) => {
  // Calculate and return object with scores and moves
  let player1Score = 0;
  let player2Score = 0;

  let player1Moves: MoveType[] = [];
  let player2Moves: MoveType[] = [];

  rounds.forEach((round) => {
    if (!round.winner || !players || !players.player1 || !players.player2) {
      return;
    }
    player1Moves.push({
      move: round.player1Choice,
      won: round.winner.id === players.player1.id,
    });
    player2Moves.push({
      move: round.player2Choice,
      won: round.winner.id === players.player2.id,
    });
    if (round.winner.id === players.player1.id) {
      player1Score += 1;
    } else if (round.winner.id === players.player2.id) {
      player2Score += 1;
    }
  });
  return {
    player1: { score: player1Score, moves: player1Moves },
    player2: { score: player2Score, moves: player2Moves },
  };
};

export const endRound = (
  gameName: string,
  players: PlayersType,
  user: UserType,
  gameState: GameStateType,
  handleEndGame: (outcome: "win" | "loss" | "draw") => void,
  handleShowIngameCountdown: (bool: boolean) => void,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetPlayerReady: () => void,
  handleSetError: (error: ErrorType) => void
) => {
  handleShowIngameCountdown(false);
  const round = gameState.rounds[gameState.currRound - 1];
  const roundWinner = getWinnerOfRound(round, players);
  if (!round || !roundWinner || roundWinner === "error") return "error";
  const updatedGameState = { ...gameState };

  // Update history
  updatedGameState.history = [
    ...gameState.history,
    {
      player1Choice: round.player1Choice,
      player2Choice: round.player2Choice,
      winner: roundWinner,
    },
  ];

  if (roundWinner === "draw") {
    // Reset selection and uppdate combatlog only, do not progress to next round.
    updatedGameState.rounds[gameState.currRound - 1].player1Choice = "none";
    updatedGameState.rounds[gameState.currRound - 1].player2Choice = "none";
    updatedGameState.combatLog = [
      ...gameState.combatLog,
      `Round ${gameState.currRound}: ${round.player1Choice} vs ${round.player2Choice} - Draw`,
    ];
  } else {
    // Set a winner for the round, determine if theres a winner for the game and the game ends, otherwise progress to next round
    updatedGameState.rounds[gameState.currRound - 1].winner = roundWinner;
    updatedGameState.combatLog = [
      ...gameState.combatLog,
      `Round ${gameState.currRound}: ${round.player1Choice} vs ${
        round.player2Choice
      } - ${`${roundWinner.name} won!`}`,
    ];
    const gameWinner = getWinnerOfGame(updatedGameState, players);
    if (gameState.currRound === gameState.rounds.length || gameWinner) {
      // If last round, or game has a winner - end game
      updatedGameState.winner = gameWinner;
      updatedGameState.status = "finished";
    } else {
      // Otherwise progress to next round
      updatedGameState.currRound = gameState.currRound + 1;
    }
  }
  console.log(updatedGameState, "NEW STATE AFTER END ROUND");

  gamesSocket.emit(
    "endRound",
    gameName,
    updatedGameState,
    (response: EndRoundStateResponseType) => {
      if (response.status === "ok" && response.gameState) {
        handleSetGameState(response.gameState);
        response.gameState.status === "finished" && response.gameState.winner
          ? handleEndGame(
              response.gameState.winner === "draw"
                ? "draw"
                : response.gameState.winner.id === user.id
                ? "win"
                : "loss"
            )
          : handleSetPlayerReady();
      } else {
        handleSetError({ status: true, message: response.status });
      }
    }
  );
};

// Helper Funcs

const getWinnerOfRound = (round: RoundType, players: PlayersType) => {
  const player1Choice = round.player1Choice;
  const player2Choice = round.player2Choice;
  if (player2Choice === null || player1Choice === null) {
    return "error";
  }
  if (player1Choice === player2Choice) {
    return "draw";
  } else if (player1Choice === "none") {
    return players.player2;
  } else if (player2Choice === "none") {
    return players.player1;
  } else if (
    (player1Choice === "rock" && player2Choice === "scissors") ||
    (player1Choice === "paper" && player2Choice === "rock") ||
    (player1Choice === "scissors" && player2Choice === "paper")
  ) {
    return players.player1;
  } else {
    return players.player2;
  }
};

const getWinnerOfGame = (gameState: GameStateType, players: PlayersType) => {
  if (gameState.currRound / gameState.rounds.length < 0.5) {
    // If not enough rounds have been played yet,  no winner
    return null;
  }
  let player1Score = 0;
  let player2Score = 0;
  gameState.rounds.forEach((round) => {
    if (!round.winner || !players || !players.player1 || !players.player2) {
      return;
    }
    if (round.winner.id === players.player1.id) {
      player1Score += 1;
    } else if (round.winner.id === players.player2.id) {
      player2Score += 1;
    }
  });

  // Determine if there's a winner
  if (player1Score > gameState.rounds.length / 2) {
    return players.player1;
  } else if (player2Score > gameState.rounds.length / 2) {
    return players.player2;
  } else {
    return null;
  }
};
