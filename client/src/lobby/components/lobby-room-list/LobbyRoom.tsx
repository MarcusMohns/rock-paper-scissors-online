import type { RoomType, ErrorType } from "../../../types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import { TransitionGroup } from "react-transition-group";
import Zoom from "@mui/material/Zoom";
import UserAvatar from "../../../components/UserAvatar.tsx";
import { useError } from "../../../hooks/useError";
import ToastAlert from "../../../components/ToastAlert.tsx";

type Props = {
  room: RoomType;
  joinRoom: (roomName: string) => Promise<ErrorType | null>;
};

const LobbyRoom = ({ room, joinRoom }: Props) => {
  const { error, handleSetError } = useError();

  const handleJoinRoom = async (roomName: string) => {
    const response = await joinRoom(roomName);
    // If theres a response it's an error
    if (response && response.status) {
      handleSetError({ status: true, message: response.message });
    }
  };

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
            <Zoom in key={user.socketId}>
              <Chip
                variant="outlined"
                sx={{ ml: 0.5, pl: 0.2 }}
                avatar={<UserAvatar user={user} size={28} />}
                label={user.name}
              />
            </Zoom>
          ))}
        </TransitionGroup>
      </Box>
      <Button
        onClick={() => handleJoinRoom(room.name)}
        color="success"
        variant="contained"
        disabled={room.users.length >= 10 || error.status}
        endIcon={<PlayCircleFilledIcon />}
      >
        Join
      </Button>
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ ...error, status: false })}
        message={error.message}
        severity="warning"
      />
    </Box>
  );
};

export default LobbyRoom;
