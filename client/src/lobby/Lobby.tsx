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
        className="lobby-content"
        component="section"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          width: "100%",
          height: "100%",
          p: { xs: 2 },
          maxWidth: { xs: "100%", lg: "80%" },
          justifyContent: "center",
          gap: { xs: 3, lg: 4 },
        }}
      >
        <LobbyRoomList joinRoom={joinRoom} createRoom={createRoom} />
        <LobbyChat />
      </Box>
    </Fade>
  );
};

export default Lobby;
