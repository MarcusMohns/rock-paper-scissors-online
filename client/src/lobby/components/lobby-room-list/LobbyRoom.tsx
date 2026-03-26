import type { RoomType, ErrorType } from "../../../types";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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
    <>
      <Paper
        className="lobby-room"
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "column",
          bgcolor: "action.hover",
          border: "1px solid",
          borderColor: "divider",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {room.name}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              p: 1.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 1,
                display: "block",
              }}
            >
              Players ({room.users.length} / 10)
            </Typography>
            <TransitionGroup>
              {room.users.map((user) => (
                <Zoom key={user.socketId}>
                  <Chip
                    variant="filled"
                    sx={{
                      ml: 0.5,
                      pl: 0.2,
                      mt: 0.3,
                    }}
                    avatar={<UserAvatar user={user} size={28} />}
                    label={user.name}
                  />
                </Zoom>
              ))}
            </TransitionGroup>
          </Box>
          <Button
            onClick={() => handleJoinRoom(room.name)}
            color="primary"
            variant="contained"
            size="medium"
            disabled={room.users.length >= 10 || error.status}
            endIcon={<PlayCircleFilledIcon />}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              transition: "all 0.2s ease-in-out",
              mt: "auto",
            }}
          >
            Join
          </Button>
        </Box>
      </Paper>
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ ...error, status: false })}
        message={error.message}
        severity="warning"
      />
    </>
  );
};

export default LobbyRoom;
