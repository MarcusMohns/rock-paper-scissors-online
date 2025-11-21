import type {
  GameType,
  GameStateType,
  UserType,
  ErrorType,
  GameStateResponseType,
} from "../../types";
import { gamesSocket } from "../../socketio/socket";

export const winGame = (
  gameState: GameStateType,
  handleSetGameState: (gameState: GameStateType) => void,
  user: UserType
) => {
  const updatedGameState = { ...gameState };
  updatedGameState.winner = user;
  updatedGameState.status = "finished";
  updatedGameState.combatLog.push(`${user.name} won the game!`);
  handleSetGameState(updatedGameState);
};

export const loseGame = (
  gameState: GameStateType,
  handleSetGameState: (gameState: GameStateType) => void,
  user: UserType
) => {
  const updatedGameState = { ...gameState };
  updatedGameState.winner = user;
  updatedGameState.status = "finished";
  handleSetGameState(updatedGameState);
};

export const concede = (
  gameName: string,
  user: UserType,
  game: GameType,
  updateGameStats: (outcome: "win" | "loss") => void,
  handleSetGameState: (gameState: GameStateType) => void,
  handleSetError: ((error: ErrorType) => void) | null
) => {
  // Give up - update stats update the gameState and emit it to other the player
  if (!game || !game.players.player1 || !game.players.player2) {
    if (handleSetError)
      // If called with an error handler
      handleSetError({ status: true, message: "Game not found" });
    return;
  }
  const winner =
    game.players.player1.id === user.id
      ? // Determine the winner as the one who didn't concede
        game.players.player2
      : game.players.player1;

  const concededGameState = {
    ...game.state,
    status: "finished",
    winner,
    combatLog: [
      ...game.state.combatLog,
      `${user.name} gave up. ${winner.name} won!`,
    ],
  };

  updateGameStats("loss");

  gamesSocket.emit(
    "concede",
    gameName,
    concededGameState,
    (response: GameStateResponseType) => {
      if (response.status === "ok" && response.gameState) {
        if (handleSetGameState)
          // If called with a game state handler
          handleSetGameState(response.gameState);
      } else {
        if (handleSetError)
          // If called with an error handler
          handleSetError({ status: true, message: response.status });
      }
    }
  );
};

export const initialGame = (rounds: number): GameType => {
  return {
    name: "",
    players: {
      player1: null,
      player2: null,
    },
    totalRounds: rounds,
    state: {
      winner: null,
      status: "waiting",
      currRound: 0,
      history: [],
      rounds: Array.from({ length: rounds }, () => ({
        player1Choice: "none",
        player2Choice: "none",
        winner: null, // 'player1', 'player2', 'draw'
      })),
      combatLog: [],
    },
  };
};

export default initialGame;
