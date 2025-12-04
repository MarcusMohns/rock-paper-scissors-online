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
} from "../../types";
import { gamesSocket } from "../../socketio/socket";

export const startGame = (
  gameName: string,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetPlayerReady: () => void,
  handleSetError: (error: ErrorType) => void
) => {
  // Prompt socketio to start the game and fetch the gamestate - update local state with response and ready up
  gamesSocket.emit("startGame", gameName, (response: GameStateResponseType) => {
    if (response.status === "ok" && response.gameState) {
      handleSetGameState(response.gameState);
      // Set the player as ready to start the round
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
  // Prompt socketio with a choice - update local state with response
  const localRoundsState =
    // Check if at least 1 choice has been registered
    gameState.rounds[gameState.currRound - 1].player1Choice ||
    gameState.rounds[gameState.currRound - 1].player2Choice
      ? gameState.rounds
      : null;

  if (!localRoundsState) {
    handleSetError({ status: true, message: "Error - no choice submitted" });
    return;
  }

  gamesSocket.emit(
    "submitChoice",
    gameName,
    selected,
    localRoundsState,
    user,
    (response: ChoiceSubmittedResponseType) => {
      if (response.status === "ok") {
        // Update local state - (socket io will emit opponentChoice for the other player)
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

export const calculateGameResults = (
  rounds: RoundType[],
  players: PlayersType
) => {
  // Calculate results of a game and return object with scores and moves
  let player1Score = 0;
  let player2Score = 0;
  let player1Moves: MoveType[] = [];
  let player2Moves: MoveType[] = [];

  const updatePlayerMoves = (move: MoveType, playerNum: number) => {
    playerNum === 1 ? [...player1Moves, move] : [...player2Moves, move];
  };

  rounds.forEach((round) => {
    // Iterate through rounds adding up scores and moves
    if (!round.winner || !players.player1 || !players.player2) {
      return;
    }
    // Update player1 Moves
    updatePlayerMoves(
      {
        move: round.player1Choice,
        // Check if the player won - if draw return false
        won: round.winner !== "draw" && round.winner.id === players.player1.id,
      },
      1
    );
    // Update player2 Moves
    updatePlayerMoves(
      {
        move: round.player2Choice,
        // Check if the player won - if draw return false
        won: round.winner !== "draw" && round.winner.id === players.player2.id,
      },
      2
    );
    // Update scores
    round.winner !== "draw" && round.winner.id === players.player1.id
      ? // Skip updating if its a draw
        player1Score++
      : player2Score++;
  });

  return {
    player1: { score: player1Score, moves: player1Moves },
    player2: { score: player2Score, moves: player2Moves },
  };
};

export const endRound = (
  gameName: string,
  players: PlayersType,
  userId: string,
  gameState: GameStateType,
  handleEndGame: (
    outcome: "win" | "loss" | "draw",
    game: GameStateType
  ) => void,
  handleShowIngameCountdown: (bool: boolean) => void,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetPlayerReady: () => void,
  handleSetError: (error: ErrorType) => void
) => {
  // Calculate results and update game state and determine if game is over
  // Called by both players at the end of a round
  handleShowIngameCountdown(false);
  const round = gameState.rounds[gameState.currRound - 1];
  const roundWinner = getWinnerOfRound(round, players);
  if (!round || !roundWinner || roundWinner === "error") return "error";

  let { history, rounds, combatLog, status, winner, currRound } = gameState;
  const match: RoundType = {
    player1Choice: round.player1Choice,
    player2Choice: round.player2Choice,
    winner: roundWinner,
  };

  // Update history
  history = [...history, match];

  if (roundWinner === "draw") {
    // Reset selection and uppdate combatlog only, do not progress to next round.
    rounds[gameState.currRound - 1].player1Choice = "none";
    rounds[gameState.currRound - 1].player2Choice = "none";
    combatLog = [
      ...gameState.combatLog,
      `Round ${gameState.currRound}: ${round.player1Choice} vs ${round.player2Choice} - Draw`,
    ];
  } else {
    // Set a winner for the round, determine if theres a winner for the game and the game ends, otherwise progress to next round
    rounds[gameState.currRound - 1].winner = roundWinner;
    combatLog = [
      ...gameState.combatLog,
      `Round ${gameState.currRound}: ${round.player1Choice} vs ${
        round.player2Choice
      } - ${`${roundWinner.name} won!`}`,
    ];
    const gameWinner = getWinnerOfGame(rounds, gameState.currRound, players);
    if (gameState.currRound === gameState.rounds.length || gameWinner) {
      // If last round, or game has a winner - update combatLog, status and winner
      winner = gameWinner;
      status = "finished";
      combatLog = [
        ...combatLog,
        `Game over! ${
          gameWinner ? `${gameWinner.name} won the game!` : "It's a draw!"
        }`,
      ];
    } else {
      // Otherwise progress to next round
      currRound++;
    }
  }

  const updatedGameState = {
    // Add all our updated values
    ...gameState,
    history,
    rounds,
    combatLog,
    status,
    winner,
    currRound,
  };

  gamesSocket.emit(
    "endRound",
    gameName,
    updatedGameState,
    (response: EndRoundStateResponseType) => {
      // Emit endRound to socketio server with our updated gamestate
      if (response.status === "ok" && response.gameState) {
        // If success,
        if (response.gameState.status === "finished") {
          // If game finishes here - call end game handler
          const outcome =
            response.gameState.winner === "draw" ||
            response.gameState.winner === null
              ? "draw"
              : response.gameState.winner.id === userId
              ? "win"
              : "loss";
          handleEndGame(outcome, response.gameState);
        } else {
          // If game is not finished - ready up for the next round and update gamestate
          handleSetPlayerReady();
          handleSetGameState(response.gameState);
        }
      } else {
        handleSetError({ status: true, message: response.status });
      }
    }
  );
};

// Helper Funcs

const getWinnerOfRound = (round: RoundType, players: PlayersType) => {
  // Calculate who won the round, return UserType
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

const getWinnerOfGame = (
  rounds: RoundType[],
  currRound: number,
  players: PlayersType
) => {
  // Calculate who won the game
  if (currRound / rounds.length < 0.5) {
    // If not enough rounds have been played yet,  no winner
    return null;
  }
  let player1Score = 0;
  let player2Score = 0;
  rounds.forEach((round) => {
    if (!round.winner || !players || !players.player1 || !players.player2) {
      return null;
    }
    if (round.winner === "draw") return null;
    if (round.winner.id === players.player1.id) {
      player1Score += 1;
    } else if (round.winner.id === players.player2.id) {
      player2Score += 1;
    }
  });

  // Determine if there's a winner
  if (player1Score > rounds.length / 2) {
    // If player 1 has won the majority of rounds
    return players.player1;
  } else if (player2Score > rounds.length / 2) {
    // If player 2 has won the majority of rounds
    return players.player2;
  } else {
    return null;
  }
};
