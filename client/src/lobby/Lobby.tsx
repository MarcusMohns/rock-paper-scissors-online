import LobbyChat from "./components/lobby-chat/LobbyChat";
import Box from "@mui/material/Box";
import LobbyRoomList from "./components/lobby-room-list/LobbyRoomList";
import Button from "@mui/material/Button";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeftRounded";
import Fade from "@mui/material/Fade";

type Props = {
  handleSetInRoom: (roomName: string) => void;
};

const Lobby = ({ handleSetInRoom }: Props) => {
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
          onClick={() => handleSetInRoom("mainMenu")}
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
          <LobbyRoomList handleSetInRoom={handleSetInRoom} />
          <LobbyChat />
        </Box>
      </Box>
    </Fade>
  );
};

export default Lobby;
