import type { RoomType } from "../../../types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { TransitionGroup } from "react-transition-group";
import Grow from "@mui/material/Grow";
import { useCallback } from "react";
import { socket } from "../../../socketio/socket";
import type { RoomResponseType } from "../../../types";
import UserAvatar from "../../../components/UserAvatar";
import { useError } from "../../../hooks/useError";
import ToastAlert from "../../../components/ToastAlert";

type Props = {
  room: RoomType;
  handleSetInRoom: (roomName: string) => void;
};
const LobbyRoom = ({ room, handleSetInRoom }: Props) => {
  const { error, handleSetError } = useError();

  const joinRoom = useCallback(
    (roomName: string) => {
      socket.emit("joinRoom", roomName, (response: RoomResponseType) => {
        if (response.status === "ok") {
          handleSetInRoom(roomName);
        } else {
          handleSetError({ status: true, message: response.status });
        }
      });
    },
    [handleSetInRoom, handleSetError]
  );

  return (
    <Box
      className="lobby-room"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: "primary.main",
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        boxShadow: 1,
      }}
    >
      <Typography variant="h6">{room.name}</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          p: 1,
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2">Max users: 10</Typography>
        <TransitionGroup>
          {room.users.map((user) => (
            <Grow in key={user.socketId}>
              <Chip
                variant="outlined"
                sx={{ ml: 0.5, pl: 0.2 }}
                avatar={<UserAvatar user={user} size={28} />}
                label={user.name}
              />
            </Grow>
          ))}
        </TransitionGroup>
      </Box>
      <Button
        onClick={() => joinRoom(room.name)}
        color="success"
        variant="contained"
        disabled={room.users.length >= 10 || error.status}
        endIcon={<PlayCircleFilledIcon />}
      >
        Join
      </Button>
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ status: false, message: "" })}
        message={error.message}
        severity="warning"
      />
    </Box>
  );
};

export default LobbyRoom;
