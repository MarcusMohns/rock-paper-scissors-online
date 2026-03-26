import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useCallback, useState, useContext } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
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

  const handleSetUserMenuState = useCallback((update: Partial<UserType>) => {
    setUserMenuState((prev) => ({ ...prev, ...update }));
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
        variant="contained"
        color="secondary"
        onClick={() => setOpen(true)}
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          py: 0.5,
          boxShadow: 2,
          width: "max-content",
          ml: "auto",
          transition: "all 0.2s ease-in-out",
          "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          sx={{
            mr: 0.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: "100px", sm: "300px" },
          }}
        >
          {user.name}
        </Typography>
        <Avatar
          sx={{
            bgcolor: user.color,
            color: "primary.contrastText",
            width: 32,
            height: 32,
            fontSize: "1rem",
          }}
        >
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
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "350px" },
            borderRadius: "16px 0 0 16px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SettingsIcon color="info" />
            <Typography sx={{ fontWeight: "bold" }}>Settings</Typography>
          </Box>
          <Button
            onClick={closeSettings}
            color="inherit"
            sx={{
              minWidth: "auto",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Close
          </Button>
        </Box>
        <Box
          sx={{
            p: 2,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "text.secondary",
            }}
          >
            Profile
          </Typography>
          <TextField
            id="outlined-required"
            label="Name"
            color="info"
            value={userMenuState.name}
            onChange={(e) => handleSetUserMenuState({ name: e.target.value })}
            spellCheck={false}
            fullWidth
            variant="outlined"
          />
          <Box
            sx={{
              bgcolor: "action.hover",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Avatar Color
            </Typography>
            <ColorPickerPopover
              userMenuState={userMenuState}
              handleSetUserMenuState={handleSetUserMenuState}
            />
          </Box>

          <Box
            sx={{
              bgcolor: "action.hover",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Theme Preference
            </Typography>
            <ToggleButtonGroup
              value={userMenuState.themePreference}
              exclusive
              onChange={(_, newThemePreference) =>
                newThemePreference &&
                handleSetUserMenuState({ themePreference: newThemePreference })
              }
              aria-label="Theme"
              fullWidth
              size="small"
            >
              <ToggleButton
                value="dark"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Dark 🌑
              </ToggleButton>
              <ToggleButton
                value="light"
                sx={{ fontWeight: "bold", textTransform: "none" }}
              >
                Light ☀️
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Button
            onClick={saveSettings}
            variant="contained"
            color="success"
            sx={{
              mt: "auto",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
              py: 1.5,
              boxShadow: 2,
              transition: "all 0.2s ease-in-out",
              "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
            }}
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default UserSettingsDrawer;
