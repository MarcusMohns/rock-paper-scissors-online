import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import UserSettingsDrawer from "./components/UserSettingsDrawer";

const Navbar = () => {
  return (
    <Box sx={{ flexGrow: 1, width: "100%" }}>
      <AppBar
        position="static"
        color="transparent"
        sx={{
          boxShadow: 0,
        }}
      >
        <UserSettingsDrawer />
      </AppBar>
    </Box>
  );
};

export default Navbar;
