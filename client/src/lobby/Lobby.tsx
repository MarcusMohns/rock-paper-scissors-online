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
          width: { xs: "100%", lg: "80%" },
          pt: 5,
          mx: { xs: 1, lg: 0 },
        }}
        className="lobby"
        component="section"
      >
        <Button
          onClick={joinMainMenu}
          color="secondary"
          variant="contained"
          size="large"
          sx={{
            width: "max-content",
          }}
          startIcon={<ArrowCircleLeftRoundedIcon />}
        >
          Back to Menu
        </Button>
        <Box
          className="lobby-content"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            width: "100%",
            justifyContent: "center",
            mt: 8,
            gap: { xs: 2, lg: 20 },
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
