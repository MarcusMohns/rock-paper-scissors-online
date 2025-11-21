import UserList from "../../components/UserList";
import { useState } from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import useUserList from "../../hooks/useUserList";

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
        justifyContent: "flex-end",
      }}
    >
      <Box className="chat-and-users">
        <Button
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          sx={{
            m: 1,
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
    </Box>
  );
};

export default UserListPopover;
