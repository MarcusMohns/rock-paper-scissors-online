import type {
  GameType,
  GameStateType,
  UserType,
  ErrorType,
  GameStateResponseType,
} from "../../types";
import { gamesSocket } from "../../socketio/socket";

export const calculateFinalState = (
  outcome: "win" | "loss",
  game: GameType,
  user: UserType
) => {
  const isPlayer1 = game.players.player1 && user.id === game.players.player1.id;
  const player1Won = outcome === "win" ? isPlayer1 : !isPlayer1;

  // Make copies of nested player objects and stats so we don't mutate original state
  const player1 = game.players.player1
    ? { ...game.players.player1, stats: { ...game.players.player1.stats } }
    : null;
  const player2 = game.players.player2
    ? { ...game.players.player2, stats: { ...game.players.player2.stats } }
    : null;

  // Update stats on the copies only
  if (player1) {
    player1.stats.wins += player1Won ? 1 : 0;
    player1.stats.losses += player1Won ? 0 : 1;
    player1.stats.rating += player1Won ? 25 : -25;
  }
  if (player2) {
    player2.stats.wins += player1Won ? 0 : 1;
    player2.stats.losses += player1Won ? 1 : 0;
    player2.stats.rating += player1Won ? -25 : 25;
  }

  const earlyExit = game.state.status !== "finished";
  if (earlyExit) {
    // Game ended before the game concluded in game loop use-gameplay (i.e someone disconnected or left)
    // Update and return game state as well as players
    const oldState = { ...game.state };
    const newState: GameStateType = {
      ...oldState,
      winner: player1Won ? player1 : player2 ? player2 : null,
      status: "finished",
      combatLog: [...oldState.combatLog, `${player1Won ? "Win" : "Loss"}`],
    };
    return { ...game, state: newState, players: { player1, player2 } };
  } else {
    return {
      ...game,
      players: { player1, player2 },
    };
  }
};

export const concede = (
  gameName: string,
  user: UserType,
  game: GameType,
  storeStatsToLocalStorage: (outcome: "win" | "loss") => void,
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

  storeStatsToLocalStorage("loss");

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
