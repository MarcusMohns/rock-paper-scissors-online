import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import type { ErrorType } from "./types";
import Fade from "@mui/material/Fade";

type Props = {
  joinRoom: (roomName: string) => Promise<ErrorType | null>;
  isConnected: boolean;
};
const MainMenu = ({ joinRoom, isConnected }: Props) => {
  const joinLobby = () => {
    joinRoom("lobby");
  };

  return (
    <Box
      component={"section"}
      className="main-menu"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        pt: 25,
        minHeight: "90vh",
        grow: 1,
      }}
    >
      <Fade in timeout={500}>
        <Box
          sx={{
            transform: "translateY(-20px)",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 400 }}>
            Main Menu
          </Typography>

          <Stack
            direction="column"
            spacing={2}
            sx={{ display: "flex", alignItems: "center", mt: 5 }}
          >
            <Button
              onClick={joinLobby}
              color="info"
              variant="outlined"
              size="large"
              disabled={!isConnected}
              endIcon={<PeopleAltIcon />}
            >
              Enter Lobby
            </Button>
            <Button color="info" variant="outlined" size="large" disabled>
              Matchmaking
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Box>
  );
};

export default MainMenu;
