import { useState, useEffect, useCallback } from "react";
import type { UserType, RoomType } from "../types";
import { socket } from "../socketio/socket";

const useRoomsList = (roomName: string) => {
  const [roomList, setRoomList] = useState<RoomType[]>([]);

  const updateRoomList = useCallback(() => {
    if (roomName === "lobby")
      socket.emit("fetchRoomsInLobby", (response: RoomType[]) => {
        setRoomList(response);
      });
  }, [roomName]);

  const onUpdateUser = useCallback(
    // Called when a user's profile is updated
    (updatedUser: UserType) => {
      // Update Room List
      const updatedRoomsState = roomList.map((room) => ({
        ...room,
        users: room.users.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        ),
      }));
      setRoomList(updatedRoomsState);
    },

    [roomList]
  );

  useEffect(() => {
    // Updates states whenever a user joins/leaves or changes their profile 'live'
    socket.on("roomJoined", updateRoomList);
    socket.on("roomLeft", updateRoomList);
    socket.on("updateUser", onUpdateUser);
    return () => {
      socket.off("roomJoined", updateRoomList);
      socket.off("roomLeft", updateRoomList);
      socket.off("updateUser", onUpdateUser);
    };
  }, [onUpdateUser, updateRoomList]);

  useEffect(() => {
    // Update states on page load
    updateRoomList();
  }, [updateRoomList]);

  return { roomList };
};

export default useRoomsList;
