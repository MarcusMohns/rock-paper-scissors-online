import LobbyChat from "./components/lobby-chat/LobbyChat";
import Box from "@mui/material/Box";
import LobbyRoomList from "./components/lobby-room-list/LobbyRoomList";
import Button from "@mui/material/Button";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import Fade from "@mui/material/Fade";
import type { ErrorType } from "../types";

type Props = {
  joinMainMenu: () => void;
  createRoom: (roomName: string) => Promise<ErrorType | null>;
  joinRoom: (roomName: string) => Promise<ErrorType | null>;
};

const Lobby = ({ joinMainMenu, joinRoom, createRoom }: Props) => {
  return (
    <Fade in timeout={600}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
          maxWidth: "80%",
          p: { xs: 2 },
        }}
        className="lobby"
        component="section"
      >
        <Button
          onClick={joinMainMenu}
          color="info"
          variant="outlined"
          sx={{
            width: "max-content",
            mb: 4,
            borderRadius: 2,
          }}
          startIcon={<ArrowCircleLeftRoundedIcon />}
        >
          Back to Main Menu
        </Button>
        <Box
          className="lobby-content"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            width: "100%",
            justifyContent: "center",
            gap: { xs: 3, lg: 4 },
            height: "100%",
          }}
        >
          <LobbyRoomList joinRoom={joinRoom} createRoom={createRoom} />
          <LobbyChat />
        </Box>
      </Box>
    </Fade>
  );
};

export default Lobby;
