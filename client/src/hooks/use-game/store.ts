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
  const isPlayer1 =
    game.players.player1 === null ? false : user.id === game.players.player1.id;
  const player1Won = outcome === "win" ? isPlayer1 : !isPlayer1;

  const updatedPlayers = { ...game.players };

  if (updatedPlayers.player1) {
    updatedPlayers.player1.stats.wins += player1Won ? 1 : 0;
    updatedPlayers.player1.stats.losses += player1Won ? 0 : 1;
    updatedPlayers.player1.stats.rating += player1Won ? 25 : -25;
  }
  if (updatedPlayers.player2) {
    updatedPlayers.player2.stats.wins += player1Won ? 0 : 1;
    updatedPlayers.player2.stats.losses += player1Won ? 1 : 0;
    updatedPlayers.player2.stats.rating += player1Won ? -25 : 25;
  }

  // const updatedGameState: GameStateType = {
  //   ...game.state,
  //   status: "finished",
  //   winner: player1Won ? game.players.player1 : game.players.player2,
  //   combatLog: [
  //     ...game.state.combatLog,
  //     `Game over! ${
  //       player1Won ? game.players.player1.name : game.players.player2.name
  //     } wins!`,
  //   ],
  // };

  const updatedGame: GameType = {
    ...game,
    players: updatedPlayers,
  };

  // Todo Error handling

  return updatedGame;
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
