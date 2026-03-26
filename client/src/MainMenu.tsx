import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import type { ErrorType } from "./types";
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";

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
        justifyContent: "center",
        width: "100%",
        minHeight: "calc(100vh - 100px)",
        grow: 1,
        p: 2,
      }}
    >
      <Fade in timeout={500}>
        <Paper
          elevation={6}
          sx={(theme) => ({
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "600px",
            width: "100%",
            bgcolor: "transparent",
            backdropFilter: "blur(10px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.2),
            boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.2)}`,
          })}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
              letterSpacing: 2,
              color: "text.primary",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            RPS Online
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
            Your Rock Paper Scissors battleground
          </Typography>
          <Stack
            direction="column"
            spacing={3}
            sx={{ width: "100%", maxWidth: "300px" }}
          >
            <Button
              onClick={joinLobby}
              color="primary"
              variant="contained"
              size="large"
              disabled={!isConnected}
              endIcon={<PeopleAltIcon />}
              fullWidth
              sx={{
                py: 2,
                borderRadius: 3,
                fontWeight: "bold",
                fontSize: "1.1rem",
                boxShadow: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: 4,
                },
              }}
            >
              Enter Lobby
            </Button>
            <Button
              color="inherit"
              variant="outlined"
              size="large"
              disabled
              fullWidth
              sx={{
                py: 2,
                borderRadius: 3,
                borderWidth: 2,
                "&:disabled": {
                  borderWidth: 2,
                },
              }}
            >
              Matchmaking (Coming Soon)
            </Button>
          </Stack>
        </Paper>
      </Fade>
    </Box>
  );
};

export default MainMenu;
