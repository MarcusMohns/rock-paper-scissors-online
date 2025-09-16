export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chatMessage: (msg: ChatMessageType) => void;
  response: (msg: string) => void;
  updateLobby: (lobby: RoomType[]) => void;
  setUser: (msg: { name: string; id: string }) => void;
  usersInRoom: (users: any[]) => void;
  updateUserList: (users: UserType[]) => void;
  roomChat: (msg: { room: string; message: string }) => void;
  updateRoomUserList: (users: UserType[]) => void;
  updateLobbyUserList: (users: UserType[]) => void;
  userDisconnecting: (user: UserType) => void;
  updateUser: (user: UserType) => void;
  roomCreated: (roomName: string) => void;
  roomJoined: (roomName: string) => void;
  roomLeft: (roomName: string) => void;
  gameLeft: (roomName: string) => void;
  gameJoined: (gameName: string) => void;
  gameCreated: (gameName: string) => void;
  startCountdown: () => void;
  cancelCountdown: () => void;
  gameReset: (data: GameType) => void;
  gameLost: (data: GameType) => void;
  gameStarted: (data: GameType) => void;
  roundEnded: (data: GameStateType) => void;
  choiceSubmitted: (data: RoundType[]) => void;
}

export interface ClientToServerEvents {
  fetchRoomsInLobby: (callback: (lobby: RoomType[]) => void) => void;
  updateRoom: (roomName: string) => void;
  hello: () => void;
  lobbyChat: (
    msg: { username: string; message: string },
    callback: (response: any) => void
  ) => void;
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
  createGame: (
    gameName: string,
    callback: (result: {
      players: {
        player1: UserType | null;
        player2: UserType | null;
      };
      status: string;
    }) => void
  ) => void;
  joinRoom: (
    roomName: string,
    callback: (result: { roomName: string; status: string }) => void
  ) => void;
  createOrJoinGame: (
    gameName: string,
    callback: (result: { status: string }) => void
  ) => void;
  leaveRoom: (roomName: string, callback: (roomName: any) => void) => void;
  connected: (user: UserType, callback: (response: any) => void) => void;
  leaveAllGames: (gameName: string) => void;
  cancelGame: (gameName: string) => void;
  leaveAllRooms: () => void;
  fetchSocketsInRoom: (
    roomName: string,
    callback: (sockets: any[]) => void
  ) => void;
  fetchUsersInRoom: (
    roomName: string,
    callback: (users: any[]) => void
  ) => void;
  fetchPlayersInGame: (
    roomName: string,
    callback: (players: PlayersType) => void
  ) => void;
  startGameCountdown: (
    roomName: string,
    callback: (response: { status: string }) => void
  ) => void;
  setUser: (user: UserType, callback: (response: any) => void) => void;
  startGame: (
    gameName: string,
    callback: ({ status, game }: { status: string; game: GameType }) => void
  ) => void;
  resetGame: (
    gameName: string,
    callback: ({ status, game }: { status: string; game: GameType }) => void
  ) => void;
  updatePlayers: (
    gameName: string,
    callback: ({ status, game }: { status: string; game: GameType }) => void
  ) => void;
  loseGame: (
    gameName: string,
    user: UserType,
    callback: ({ status, game }: { status: string; game: GameType }) => void
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
    }: {
      status: string;
      gameState: GameStateType | null;
    }) => void
  ) => void;
  cancelGameCountdown: (roomName: string) => void;
  UserListRendered: (
    roomName: string,
    callback: (response: any) => void
  ) => void;
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
  //   message: (msg: string) => void;
}

export interface SocketData {
  id: string;
  user: { name: string; id: string };
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
  roundNum: number;
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
};

export type RoomType = {
  name: string;
  users: UserType[];
};

export type PlayersType = {
  player1: UserType | null;
  player2: UserType | null;
};

export type WinnerOfRoundResponseType = "error" | "draw" | UserType;
