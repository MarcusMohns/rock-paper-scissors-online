import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { UserType } from "../../types";
import { memo } from "react";
import { useEffect, useCallback, useState } from "react";
import { socket } from "../../socketio/socket";

type Props = {
  roomName: string;
};
const RoomInfo = ({ roomName }: Props) => {
  const [usersInRoom, setUsersInRoom] = useState<UserType[]>([]);
  const updateUserList = useCallback(() => {
    socket.emit("fetchUsersInRoom", roomName, (response: UserType[]) => {
      setUsersInRoom(response);
    });
  }, [roomName, setUsersInRoom]);

  const onUpdateUser = useCallback(
    (updatedUser: UserType) => {
      // Update User List
      const updatedUsersState = usersInRoom.map((user) =>
        user.id === updatedUser.id ? updatedUser : user
      );
      setUsersInRoom(updatedUsersState);
    },
    [usersInRoom, setUsersInRoom]
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

  return (
    <Box
      className="room-info"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "flex-start",
        alignItems: "center",
        mt: { xs: 0, sm: 1 },
        px: { xs: 0, sm: 2 },
        gap: { xs: 0, sm: 3 },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="overline">Room name: {roomName}</Typography>
      <Typography variant="overline">Max users: 10</Typography>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        <Typography
          variant="overline"
          sx={{
            mr: { xs: 0, sm: 1 },
          }}
        >
          Users:
        </Typography>
        {usersInRoom.map((user, idx) => (
          <Typography
            variant="overline"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              textTransform: "capitalize",
              maxWidth: "100px",
            }}
            key={user.name + idx}
          >
            {usersInRoom.length === idx + 1 ? user.name : user.name + ", "}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default memo(RoomInfo);
