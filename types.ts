export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  chatMessage: (msg: ChatMessageType) => void;
  response: (msg: string) => void;
  updateLobby: (lobby: RoomType[]) => void;
  setUser: (msg: { name: string; id: string }) => void;
  fetchSocketsInRoom: (sockets: any[]) => void;
  fetchUsersInRoom: (users: any[]) => void;
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
    callback: (roomName: any, users: any) => void
  ) => void;
  joinRoom: (
    roomName: string,
    callback: (roomName: any, users: any) => void
  ) => void;
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
  setUser: (user: UserType, callback: (response: any) => void) => void;

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
  id: string;
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
