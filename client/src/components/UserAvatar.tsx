import Avatar from "@mui/material/Avatar";
import type { UserType } from "../types";
import { Typography } from "@mui/material";
const UserAvatar = ({ user, size = 40 }: { user: UserType; size: number }) => {
  const userInitial = user.name[0] ? user.name[0] : "?";
  return (
    <Avatar
      sx={{
        bgcolor: user.color,
        width: size,
        height: size,
      }}
      alt={user.name}
      aria-label={`${user.name} avatar`}
      className="avatar"
    >
      <Typography variant="subtitle2">{userInitial}</Typography>
    </Avatar>
  );
};

export default UserAvatar;
