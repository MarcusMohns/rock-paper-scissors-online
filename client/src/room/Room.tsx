import { useCallback, useState } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Fade from "@mui/material/Fade";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";

import UserListPopover from "./components/UserListPopover";
import RoomChat from "./components/RoomChat";
import Game from "./components/game/Game";
import RoomInfo from "./components/RoomInfo";
import { Paper } from "@mui/material";

type Props = {
  roomName: string;
  joinRoom: (roomName: string) => void;
};

const Room = ({ roomName, joinRoom }: Props) => {
  const [inGame, setInGame] = useState(false);
  const handleSetInGame = useCallback((inGame: boolean) => {
    setInGame(inGame);
  }, []);

  const backToLobby = () => {
    joinRoom("lobby");
  };

  return (
    <Fade in={true} timeout={400}>
      <Box
        className="room"
        component="section"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          width: { xs: "100%", lg: "70%" },
          pt: 5,
          mx: { xs: 1, xl: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mb: 2,
            width: "max-content",
            alignItems: "center",
          }}
        >
          <Button
            onClick={backToLobby}
            color="info"
            variant="contained"
            disabled={inGame}
            sx={{
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              transition: "all 0.2s ease-in-out",
              width: "max-content",
              ml: { xs: 2, xl: 0 },
            }}
            startIcon={<ArrowCircleLeftRoundedIcon />}
          >
            Leave Room
          </Button>
          <Box sx={{ minHeight: "24px", mt: 0.5 }}>
            {inGame && (
              <Typography
                variant="caption"
                color="error"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                • Currently in game
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          className="info-game-container"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: { xs: "97%", xl: "100%" },
            mx: "auto",
            py: { xs: 0, xl: 1 },
          }}
        >
          <RoomInfo roomName={roomName} />
          <Box
            className="game-and-chat-container"
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: { xs: "column", xl: "row" },
              mt: 2,
            }}
          >
            <Game
              gameName={roomName}
              inGame={inGame}
              handleSetInGame={handleSetInGame}
            />
            <Paper
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 4,
                boxShadow: 6,
                overflow: "hidden",
                height: "100%",
                width: { xs: "100%", xl: "50%" },
                mx: { xs: 0, xl: 5 },
                mt: 1,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  bgcolor: "action.hover",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Chat
                </Typography>
                <UserListPopover roomName={roomName} />
              </Stack>
              <RoomChat roomName={roomName} />
            </Paper>
          </Box>
          {/* The socketio 'room' we use to host the game is referred to as 'game', 'games', 'gameName' etc and is named the same as the room name  */}
        </Box>
      </Box>
    </Fade>
  );
};

export default Room;
