import { UserType, GameStateType } from "./types";

type initialGameStateProp = {
  gameName: string;
  players: {
    player1: UserType | null;
    player2: UserType | null;
  };
  state: GameStateType;
};

export const defaultGameState: GameStateType = {
  winner: null,
  status: "waiting",
  rounds: [
    { player1Choice: null, player2Choice: null, winner: null },
    { player1Choice: null, player2Choice: null, winner: null },
    { player1Choice: null, player2Choice: null, winner: null },
  ],
  combatLog: ["Game has been reset"],
};

export const startedGameState: GameStateType = {
  winner: null,
  status: "playing",
  rounds: [
    { player1Choice: null, player2Choice: null, winner: null },
    { player1Choice: null, player2Choice: null, winner: null },
    { player1Choice: null, player2Choice: null, winner: null },
  ],
  combatLog: ["Game has started!"],
};

export const gameData = ({
  gameName,
  players,
  state = defaultGameState,
}: initialGameStateProp) => {
  return {
    name: gameName,
    players,
    state,
  };
};

// const playingGameState = {
//   name: "",
//   players: players,
//   state: {
//     winner: null,
//     status: "playing",
//     rounds: [
//       { player1Choice: null, player2Choice: null, winner: null },
//       { player1Choice: null, player2Choice: null, winner: null },
//       { player1Choice: null, player2Choice: null, winner: null },
//     ],
//     combatLog: [],
//   },
// };

export default gameData;
