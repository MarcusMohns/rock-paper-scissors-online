import { UserType, GameStateType, RoundType } from "./types";

type initialGameStateProp = {
  gameName: string;
  players: {
    player1: UserType | null;
    player2: UserType | null;
  };
  state: GameStateType;
};

export const defaultGameData = (): initialGameStateProp => {
  return {
    gameName: "",
    players: {
      player1: null,
      player2: null,
    },
    state: { ...defaultGameState(3) },
  };
};

export const defaultGameState = (rounds: number): GameStateType => {
  return {
    winner: null,
    status: "waiting",
    roundNum: 0,
    rounds: Array.from({ length: rounds }, () => ({
      player1Choice: null,
      player2Choice: null,
      winner: null, // 'player1', 'player2', 'draw'
    })),
    combatLog: [],
  };
};

export const startedGameState = (rounds: number): GameStateType => {
  return {
    winner: null,
    status: "playing",
    roundNum: 1,
    rounds: Array.from({ length: rounds }, () => ({
      player1Choice: null,
      player2Choice: null,
      winner: null, // 'player1', 'player2', 'draw'
    })),
    combatLog: ["Game has started!"],
  };
};

export const gameData = ({
  gameName,
  players,
  state,
}: initialGameStateProp) => {
  return {
    name: gameName,
    players,
    state,
  };
};

export let roundState: RoundType = {
  player1Choice: null,
  player2Choice: null,
  winner: null,
};
export default gameData;
