import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import UserSettingsDrawer from "./components/UserSettingsDrawer";

type Props = {
  joinMainMenu: () => void;
  inRoom: string;
};

const Navbar = ({ joinMainMenu, inRoom }: Props) => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          boxShadow: 0,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {(inRoom === "lobby" || inRoom === "mainMenu") && (
            <Button
              onClick={joinMainMenu}
              variant="contained"
              color="primary"
              startIcon={<HomeRoundedIcon />}
              sx={{
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                boxShadow: 2,
                transition: "all 0.2s ease-in-out",
                "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
              }}
            >
              Main Menu
            </Button>
          )}
          <UserSettingsDrawer />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
