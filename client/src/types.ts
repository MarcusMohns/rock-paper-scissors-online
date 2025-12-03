export type UserType = {
  id: string;
  name: string;
  socketId: string;
  color: string;
  themePreference: string;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    rating: number;
  };
};

export type ErrorResponseType = {
  type: "error";
  data: ErrorType;
};

export type UserResponseType = {
  type: "ok";
  data: UserType;
};

export type ErrorType = {
  status: boolean;
  message: string;
};

export type RoomType = {
  name: string;
  users: UserType[];
};

export type ChatMessageType = {
  userId: string;
  name: string;
  message: string;
};

export type MessageType = {
  message: string;
  user: UserType;
  date: string;
};

export type RoomResponseType = {
  roomName: string;
  status: string;
};

export type ChoiceSubmittedResponseType = {
  status: "ok" | "error";
  updatedRounds: RoundType[];
};
export type ResponseType = {
  status: string;
};

export type PlayersType = {
  player1: UserType | null;
  player2: UserType | null;
};

export type PlayersResponseType = {
  players: PlayersType;
  status: string;
};

export type GameDataResponseType = {
  status: string;
  game: {
    name: string;
    players: {
      player1: UserType | null;
      player2: UserType | null;
    };
    state: {
      winner: UserType | "draw" | null;
      status: StatusType;
      currRound: number;
      rounds: RoundType[];
      combatLog: string[];
    };
  };
};
export type MoveType = {
  move: string;
  won: boolean;
};

export type GameStateResponseType = {
  status: string;
  gameState: GameStateType | null;
};
export type GameResponseType = {
  status: string;
  game: GameType | null;
};

export type EndRoundStateResponseType = {
  status: string;
  gameState: GameStateType | null;
  isPlayer1: boolean;
};

export type StatusType = "waiting" | "playing" | "finished";

export type GameType = {
  name: string;
  totalRounds: number;
  players: {
    player1: UserType | null;
    player2: UserType | null;
  };
  state: GameStateType;
};

export type GameOptionsType = {
  // name: string;
  totalRounds: number;
};

export type SetSocketDataResponse = {
  status: string;
  game: GameType | null;
};

export type WinnerType = UserType | "draw" | null;

export type GameStateType = {
  winner: WinnerType;
  status: StatusType;
  currRound: number;
  history: RoundHistoryType[];
  rounds: RoundType[];
  combatLog: string[];
};

export type RoundType = {
  player1Choice: RockPaperScissor;
  player2Choice: RockPaperScissor;
  winner: WinnerType;
};

export type RoundHistoryType = {
  player1Choice: RockPaperScissor;
  player2Choice: RockPaperScissor;
  winner: WinnerType;
};

export type RockPaperScissor = "rock" | "paper" | "scissors" | "none";
