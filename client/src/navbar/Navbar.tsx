import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import UserSettingsDrawer from "./components/UserSettingsDrawer";

const Navbar = () => {
  return (
    <Box
      sx={{ flexGrow: 1, width: "100%" }}
      component={"nav"}
      className="navbar"
    >
      <AppBar
        position="static"
        sx={{
          boxShadow: 0,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Rock Paper Scissors
          </Typography>
          <UserSettingsDrawer />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
