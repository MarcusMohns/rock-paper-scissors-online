import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import type { UserType } from "../../types";
import colors from "../../store";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type Props = {
  userMenuState: UserType;
  handleSetUserMenuState: (user: UserType) => void;
};
const UserSettingsPopover = ({
  userMenuState,
  handleSetUserMenuState,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleColorSelect = (color: string) => {
    setAnchorEl(null);
    handleSetUserMenuState({ ...userMenuState, color: color });
  };

  const open = Boolean(anchorEl);
  return (
    <>
      <Button aria-describedby={"popover"} variant="text" onClick={handleOpen}>
        <Avatar
          sx={{ bgcolor: userMenuState.color, color: "primary.contrastText" }}
        >
          {userMenuState.name[0]}
        </Avatar>
        <ExpandMoreIcon
          sx={{
            color: "primary.contrastText",
          }}
        />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            maxHeight: "200px",
            minWidth: "175px",
          }}
        >
          {colors.map((color: string) => (
            <IconButton key={color} onClick={() => handleColorSelect(color)}>
              <Box
                sx={{ p: 1, width: "25px", height: "25px", bgcolor: color }}
              />
            </IconButton>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default UserSettingsPopover;
