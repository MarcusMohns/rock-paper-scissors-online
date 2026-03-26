import UserList from "../../components/UserList";
import { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import useUserList from "../../hooks/useUserList";
import { alpha } from "@mui/material";

type Props = {
  roomName: string;
};
const UserListPopover = ({ roomName }: Props) => {
  const { userList } = useUserList({ roomName });
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "users-popover" : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Button
        aria-describedby={id}
        variant="contained"
        color="info"
        size="small"
        onClick={handleClick}
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          boxShadow: 2,
          transition: "all 0.2s ease-in-out",
          bgcolor: (theme) => alpha(theme.palette.info.main, 0.75),
          "&:hover": {
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.95),
            boxShadow: 4,
          },
        }}
      >
        <SupervisedUserCircleIcon /> ({userList.length})
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableScrollLock={true}
      >
        <UserList userList={userList} />
      </Popover>
    </Box>
  );
};

export default UserListPopover;
