import { useState, useEffect, useCallback } from "react";
import type { UserType } from "../types";
import { socket } from "../socketio/socket";

const useUserList = ({ roomName }: { roomName: string }) => {
  const [userList, setUserList] = useState<UserType[]>([]);

  const updateUserList = useCallback(() => {
    socket.emit("fetchUsersInRoom", roomName, (response: UserType[]) => {
      console.log("Fetched user list:", response, "updateUserList called");
      setUserList(response);
    });
  }, [roomName, setUserList]);

  const onUpdateUser = useCallback(
    (updatedUser: UserType) => {
      // Update User List
      const updatedUsersState = userList.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUserList(updatedUsersState);
    },
    [userList, setUserList]
  );

  useEffect(() => {
    // Updates state whenever a user joins/leaves or changes their profile 'live'
    socket.on("roomJoined", updateUserList);
    socket.on("roomLeft", updateUserList);
    socket.on("updateUser", onUpdateUser);
    return () => {
      socket.off("roomJoined", updateUserList);
      socket.off("roomLeft", updateUserList);
      socket.off("updateUser", onUpdateUser);
    };
  }, [updateUserList, onUpdateUser]);

  useEffect(() => {
    // Update states on page load
    updateUserList();
  }, [updateUserList]);

  return { userList };
};

export default useUserList;
