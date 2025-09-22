import { UserType, GameStateType, RoundType } from "./types";

type initialGameStateProp = {
  gameName: string;
  players: {
    player1: UserType | null;
    player2: UserType | null;
  };
  totalRounds: number;
  state: GameStateType;
};

export const defaultGameData = (): initialGameStateProp => {
  return {
    gameName: "",
    players: {
      player1: null,
      player2: null,
    },
    totalRounds: 0,
    state: { ...defaultGameState(3) },
  };
};

export const defaultGameState = (rounds: number): GameStateType => {
  return {
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
  };
};

export const startedGameState = (rounds: number): GameStateType => {
  return {
    winner: null,
    status: "playing",
    currRound: 1,
    history: [],
    rounds: Array.from({ length: rounds }, () => ({
      player1Choice: "none",
      player2Choice: "none",
      winner: null, // 'player1', 'player2', 'draw'
    })),
    combatLog: ["Game has started!"],
  };
};

export const gameData = ({
  gameName,
  players,
  state,
  totalRounds,
}: initialGameStateProp) => {
  return {
    name: gameName,
    players,
    totalRounds,
    state,
  };
};

export let roundState: RoundType = {
  player1Choice: "none",
  player2Choice: "none",
  winner: null,
};
export default gameData;
