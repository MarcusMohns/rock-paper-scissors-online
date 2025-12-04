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
          }}
        >
          <Button
            onClick={backToLobby}
            color="secondary"
            variant="contained"
            disabled={inGame}
            size="large"
            sx={{
              width: "max-content",
              ml: { xs: 2, xl: 0 },
            }}
            startIcon={<ArrowCircleLeftRoundedIcon />}
          >
            Leave Room
          </Button>
          <Typography
            variant="overline"
            color="error"
            sx={{
              minHeight: "35px",
              ml: { xs: 9, xl: 7 },
            }}
          >
            {inGame && "In game"}
          </Typography>
        </Box>
        <Box
          className="info-game-container"
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
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
            <Stack
              className="room-chat"
              direction="column"
              sx={{
                display: "flex",
                backgroundColor: "background.paper",
                borderRadius: 1,
                boxShadow: 3,
                height: "100%",
                width: { xs: "100%", xl: "50%" },
                mx: { xs: 0, xl: 5 },
                mt: 1,
              }}
            >
              <UserListPopover roomName={roomName} />
              <RoomChat roomName={roomName} />
            </Stack>
          </Box>
          {/* The socketio 'room' we use to host the game is referred to as 'game', 'games', 'gameName' etc and is named the same as the room name  */}
        </Box>
      </Box>
    </Fade>
  );
};

export default Room;
