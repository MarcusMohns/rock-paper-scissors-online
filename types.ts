export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chatMessage: (msg: ChatMessageType) => void;
  response: (msg: string) => void;
  updateLobby: (lobby: LobbyStateType) => void;
  setUser: (msg: { name: string; id: string }) => void;
  fetchSocketsInRoom: (sockets: any[]) => void;
  fetchUsersInRoom: (users: any[]) => void;
  usersInRoom: (users: any[]) => void;
  updateUserList: (users: UserType[]) => void;
  roomChat: (msg: { room: string; message: string }) => void;
}

export interface ClientToServerEvents {
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
  createRoom: (socket: any, callback: (response: any) => void) => void;
  joinRoom: (roomName: string, callback: (response: any) => void) => void;
  connected: (user: UserType, callback: (response: any) => void) => void;
  leaveAllRooms: () => void;
  fetchSocketsInRoom: (
    roomName: string,
    callback: (sockets: any[]) => void
  ) => void;
  fetchUsersInRoom: (
    roomName: string,
    callback: (users: any[]) => void
  ) => void;
  setUser: (
    user: UserType,
    roomName: string,
    callback: (response: any) => void
  ) => void;
  UserListRendered: (
    roomName: string,
    callback: (response: any) => void
  ) => void;
}

export interface InterServerEvents {
  ping: () => void;
  //   message: (msg: string) => void;
}

export interface SocketData {
  user: { name: string; id: string };
}

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
export type LobbyStateType = {
  rooms: RoomType[];
};
