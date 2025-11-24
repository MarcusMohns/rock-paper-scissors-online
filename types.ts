export interface ServerToClientEvents {
  chatMessage: (msg: ChatMessageType) => void;
  updateUser: (user: UserType) => void;
  roomJoined: (roomName: string) => void;
  roomLeft: (roomName: string) => void;
  gameLeft: (roomName: string) => void;
  gameJoined: (gameName: string) => void;
  startCountdown: () => void;
  cancelCountdown: () => void;
  gameReset: (data: GameType) => void;
  opponentConceded: (data: GameStateType) => void;
  roundEndedForSpectators: (data: GameStateType) => void;
  opponentChoice: (data: RoundType[]) => void;
  opponentReady: () => void;
}

export interface ClientToServerEvents {
  fetchRoomsInLobby: (callback: (lobby: RoomType[]) => void) => void;
  chatMessage: (
    msg: {
      username: string;
      message: string;
      date: string;
      room: string;
    },
    callback: (response: any) => void
  ) => void;
  createRoom: (
    roomName: string,
    callback: (result: { roomName: string; status: string }) => void
  ) => void;
  joinRoom: (
    roomName: string,
    callback: (result: { roomName: string; status: string }) => void
  ) => void;
  createOrJoinGame: (
    gameName: string,
    callback: (result: { status: string }) => void
  ) => void;
  connected: (user: UserType, callback: (response: any) => void) => void;
  leaveAllGames: (gameName: string) => void;
  fetchUsersInRoom: (
    roomName: string,
    callback: (users: any[]) => void
  ) => void;
  startGameCountdown: (
    roomName: string,
    callback: (response: { status: string }) => void
  ) => void;
  setUser: (user: UserType, callback: (response: any) => void) => void;
  startGame: (
    gameName: string,
    callback: ({
      status,
      gameState,
    }: {
      status: string;
      gameState: GameStateType | null;
    }) => void
  ) => void;
  resetGame: (
    gameName: string,
    callback: ({ status, game }: { status: string; game: GameType }) => void
  ) => void;
  concede: (
    gameName: string,
    concededGameState: GameStateType,
    callback: ({
      status,
      gameState,
    }: {
      status: string;
      gameState: GameStateType | null;
    }) => void
  ) => void;
  submitChoice: (
    gameName: string,
    selected: RockPaperScissor,
    localRoundsState: RoundType[] | null,
    user: UserType,
    callback: ({
      status,
      updatedRounds,
    }: {
      status: string;
      updatedRounds: RoundType[] | null;
    }) => void
  ) => void;
  endRound: (
    gameName: string,
    updatedGameState: GameStateType,
    callback: ({
      status,
      gameState,
      isPlayer1,
    }: {
      status: string;
      gameState: GameStateType | null;
      isPlayer1: boolean | null;
    }) => void
  ) => void;
  cancelGameCountdown: (roomName: string) => void;
  fetchPlayers: (
    gameName: string,
    callback: ({
      status,
      players,
    }: {
      status: string;
      players: PlayersType | null;
    }) => void
  ) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  id: string;
  user: UserType;
  game: GameType;
}

export type SetSocketGameStateResponse = {
  status: string;
  gameState: GameStateType | null;
  game: GameType | null;
};

export type GameType = {
  name: string;
  players: {
    player1: UserType | null;
    player2: UserType | null;
  };
  state: GameStateType;
} | null;

export type GameStateType = {
  winner: UserType | "draw" | null;
  status: "waiting" | "playing" | "finished";
  currRound: number;
  history: RoundType[];
  rounds: RoundType[];
  combatLog: string[];
};

export type RoundType = {
  player1Choice: RockPaperScissor;
  player2Choice: RockPaperScissor;
  winner: UserType | "draw" | null;
};

export type RockPaperScissor = "rock" | "paper" | "scissors" | "none" | null;

export type ChatMessageType = {
  username: string;
  message: string;
  date: string;
  room: string;
};

export type UserType = {
  name: string;
  id: string;
  socketId: string;
  stats: {
    wins: number;
    losses: number;
    draws: number;
    rating: number;
  };
  color: string;
  themePreference: string;
};

export type RoomType = {
  name: string;
  users: UserType[];
};

export type PlayersType = {
  player1: UserType | null;
  player2: UserType | null;
};
