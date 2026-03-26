import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { UserType } from "../../types";
import { memo } from "react";
import { useEffect, useCallback, useState } from "react";
import { socket } from "../../socketio/socket";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

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
        user.id === updatedUser.id ? updatedUser : user,
      );
      setUsersInRoom(updatedUsersState);
    },
    [usersInRoom, setUsersInRoom],
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
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        mt: { xs: 0, sm: 1 },
        py: 1.5,
        px: { xs: 1, sm: 2 },
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "action.hover",
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <MeetingRoomIcon fontSize="small" color="info" />
        <Typography
          variant="caption"
          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          Room: {roomName}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "action.hover",
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <PeopleAltIcon fontSize="small" color="info" />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", textTransform: "uppercase" }}
          >
            Users:
          </Typography>
          {usersInRoom.map((user, idx) => (
            <Typography
              variant="caption"
              key={user.name + idx}
              sx={{
                fontWeight: "bold",
                color: "text.secondary",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textTransform: "capitalize",
                maxWidth: "100px",
              }}
            >
              {user.name}
              {idx < usersInRoom.length - 1 ? ", " : ""}
            </Typography>
          ))}
          <Typography
            variant="caption"
            sx={{
              ml: 1,
              color: "text.disabled",
              fontWeight: "bold",
            }}
          >
            ({usersInRoom.length}/10)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(RoomInfo);
