import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import Slide from "@mui/material/Slide";

type Props = {
  joinLobby: () => void;
  isConnected: boolean;
};
const MainMenu = ({ joinLobby, isConnected }: Props) => {
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
      <Slide direction="down" in={true} timeout={400}>
        <Typography variant="h2" sx={{ fontWeight: 400 }}>
          Main Menu
        </Typography>
      </Slide>

      <Stack
        direction="column"
        spacing={2}
        sx={{ display: "flex", alignItems: "center", mt: 5 }}
      >
        <Slide direction="left" in={true} timeout={400}>
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
        </Slide>
        <Slide direction="right" in={true} timeout={400}>
          <Button color="info" variant="outlined" size="large" disabled>
            Matchmaking
          </Button>
        </Slide>
      </Stack>
    </Box>
  );
};

export default MainMenu;
