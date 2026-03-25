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
  handleSetError: (error: ErrorType) => void,
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
  handleSetError: (error: ErrorType) => void,
) => {
  // Prompt socketio with a choice - update local state with response
  const localRoundsState =
    // Check if at least 1 choice has been registered
    gameState.currRound > 0 && gameState.rounds[gameState.currRound - 1]
      ? gameState.rounds
      : null;

  if (!localRoundsState || gameState.currRound === 0) {
    // Added explicit check for currRound
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
    },
  );
};

export const calculateGameResults = (
  rounds: RoundType[],
  players: PlayersType,
) => {
  // Calculate results of a game and return object with scores and moves
  let player1Score = 0;
  let player2Score = 0;
  let player1Moves: MoveType[] = [];
  let player2Moves: MoveType[] = [];

  const updatePlayerMoves = (move: MoveType, playerNum: number) => {
    if (playerNum === 1) {
      player1Moves.push(move);
    } else {
      player2Moves.push(move);
    }
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
      1,
    );
    // Update player2 Moves
    updatePlayerMoves(
      {
        move: round.player2Choice,
        // Check if the player won - if draw return false
        won: round.winner !== "draw" && round.winner.id === players.player2.id,
      },
      2,
    );
    // Update scores only if there's a clear winner for the round
    if (round.winner !== "draw") {
      if (round.winner.id === players.player1.id) {
        player1Score++;
      } else {
        player2Score++;
      }
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
  userId: string,
  gameState: GameStateType,
  handleEndGame: (
    outcome: "win" | "loss" | "draw",
    game: GameStateType,
  ) => void,
  handleShowIngameCountdown: (bool: boolean) => void,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetPlayerReady: () => void,
  handleSetError: (error: ErrorType) => void,
) => {
  // Calculate results and update game state and determine if game is over
  // Called by both players at the end of a round
  handleShowIngameCountdown(false);
  const round = gameState.rounds[gameState.currRound - 1];
  const roundWinner = getWinnerOfRound(round, players);
  if (!round || !roundWinner || roundWinner === "error") return "error";

  // Avoid direct mutation by spreading arrays
  let history = [...gameState.history];
  let rounds = [...gameState.rounds];
  let combatLog = [...gameState.combatLog];
  let { status, winner, currRound } = gameState;

  const match: RoundType = {
    player1Choice: round.player1Choice,
    player2Choice: round.player2Choice,
    winner: roundWinner,
  };

  // Update history
  history = [...history, match];

  // Create a new object for the current round to avoid mutation
  const updatedRound = { ...rounds[currRound - 1] };

  if (roundWinner === "draw") {
    updatedRound.player1Choice = "none";
    updatedRound.player2Choice = "none";
    combatLog.push(
      `Round ${currRound}: ${round.player1Choice} vs ${round.player2Choice} - Draw`,
    );
  } else {
    updatedRound.winner = roundWinner;
    // Update the rounds array before checking for a game winner
    rounds[currRound - 1] = updatedRound;

    combatLog.push(
      `Round ${currRound}: ${round.player1Choice} vs ${round.player2Choice} - ${roundWinner.name} won!`,
    );

    const gameWinner = getWinnerOfGame(rounds, currRound, players);
    if (currRound === rounds.length || gameWinner) {
      // If last round, or game has a winner - update combatLog, status and winner
      winner = gameWinner;
      status = "finished";
      combatLog.push(
        `Game over! ${gameWinner ? `${gameWinner.name} won the game!` : "It's a draw!"}`,
      );
    } else {
      // Otherwise progress to next round
      currRound++;
    }
  }

  if (roundWinner === "draw") {
    rounds[currRound - 1] = updatedRound;
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
    },
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
  players: PlayersType,
) => {
  // Calculate who won the game
  let player1Score = 0;
  let player2Score = 0;

  for (const round of rounds) {
    if (!round.winner || !players.player1 || !players.player2) continue;
    if (round.winner === "draw") continue;

    if (round.winner.id === players.player1.id) {
      player1Score += 1;
    } else if (round.winner.id === players.player2.id) {
      player2Score += 1;
    }
  }

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
