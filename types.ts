export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chatMessage: (msg: string) => void;
  response: (msg: string) => void;
  updateLobby: (msg: any) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  chatMessage: (msg: string, callback: (response: any) => void) => void;
  createRoom: (roomName: string, callback: (response: any) => void) => void;
  joinRoom: (roomName: string, callback: (response: any) => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
  //   message: (msg: string) => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export type RoomType = {
  name: string | object;
  users: string[];
};
export type LobbyStateType = {
  rooms: RoomType[];
};
