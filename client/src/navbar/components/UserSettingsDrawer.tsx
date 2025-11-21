import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCallback, useState, useContext } from "react";
import type { UserType } from "../../types";
import ColorPickerPopover from "./ColorPickerPopover";
import { UserContext } from "../../Context";

const UserSettingsDrawer = () => {
  const { user, handleSetUser } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const closeSettings = () => setOpen(false);

  const [userMenuState, setUserMenuState] = useState({
    name: user.name,
    id: user.id,
    socketId: user.socketId,
    color: user.color,
    themePreference: user.themePreference,
    stats: user.stats,
  });

  const handleSetUserMenuState = useCallback((user: UserType) => {
    setUserMenuState(user);
  }, []);

  const saveSettings = () => {
    closeSettings();
    if (JSON.stringify(user) !== JSON.stringify(userMenuState))
      // Only update state if theres some new value
      handleSetUser(userMenuState);
  };

  return (
    <>
      <Button
        aria-describedby={"popover"}
        variant="text"
        color="inherit"
        onClick={() => setOpen(true)}
        sx={{
          textTransform: "none",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mr: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: "100px", sm: "300px" },
          }}
        >
          {user.name}
        </Typography>

        <Avatar sx={{ bgcolor: user.color, color: "primary.contrastText" }}>
          {user.name[0]}
        </Avatar>
      </Button>
      <Drawer
        disableScrollLock={true}
        open={open}
        className="drawer"
        role="presentation"
        anchor="right"
        onClose={saveSettings}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{
              p: 2,
              fontWeight: "bold",
            }}
          >
            Settings
          </Typography>
          <Button
            onClick={closeSettings}
            variant="text"
            color="info"
            sx={{
              height: "max-content",
            }}
          >
            ✖
          </Button>
        </Box>
        <Box
          sx={{
            p: 2,
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            id="outlined-required"
            label="Name"
            color="info"
            value={userMenuState.name}
            onChange={(e) =>
              handleSetUserMenuState({ ...userMenuState, name: e.target.value })
            }
            spellCheck={false}
          />
          <Box>
            <Typography variant="subtitle2">Avatar Color</Typography>
            <ColorPickerPopover
              userMenuState={userMenuState}
              handleSetUserMenuState={handleSetUserMenuState}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2">Theme</Typography>
            <ToggleButtonGroup
              value={userMenuState.themePreference}
              exclusive
              onChange={(_, newThemePreference) =>
                handleSetUserMenuState({
                  ...userMenuState,
                  themePreference: newThemePreference,
                })
              }
              aria-label="Theme"
            >
              <ToggleButton value="dark">Dark 🌑</ToggleButton>
              <ToggleButton value="light">Light ☀️</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Button
            onClick={saveSettings}
            variant="contained"
            color="success"
            sx={{ mt: "auto" }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default UserSettingsDrawer;
