import { useCallback, useState } from "react";
import { socket, gamesSocket } from "../socketio/socket";
import type { RoomResponseType } from "../types";

export const useInRoom = () => {
  const [inRoom, setInRoom] = useState<string>("mainMenu");

  const joinRoom = useCallback((roomName: string) => {
    socket.emit("joinRoom", roomName, (response: RoomResponseType) => {
      setInRoom(response.roomName);
    });
    gamesSocket.emit("leaveAllGames", roomName);
  }, []);

  const joinLobby = useCallback(async () => {
    joinRoom("lobby");
  }, [joinRoom]);

  const handleSetInRoom = useCallback((roomName: string) => {
    setInRoom(roomName);
  }, []);

  return { inRoom, joinRoom, joinLobby, handleSetInRoom };
};

export default useInRoom;
