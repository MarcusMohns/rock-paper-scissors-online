import List from "@mui/material/List";
import { alpha } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import type { UserType } from "../types.ts";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import { TransitionGroup } from "react-transition-group";
import UserAvatar from "./UserAvatar.tsx";

type Props = {
  userList: UserType[];
};
const UserList = ({ userList }: Props) => {
  return (
    <List className="user-list" component="div" sx={{ py: 1 }}>
      {userList.length === 0 && <ListItem>No users</ListItem>}
      <TransitionGroup>
        {userList.map((user) => {
          return (
            <Zoom key={user.id}>
              <ListItem
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.1),
                    transform: "translateX(8px)",
                  },
                }}
              >
                <ListItemIcon>
                  <UserAvatar user={user} size={40} />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body1"
                      fontSize={16}
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontWeight: "bold",
                        color: "text.primary",
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      fontSize={12}
                      sx={{ color: "text.secondary", fontWeight: 500 }}
                    >
                      Rating: {user.stats.rating}⭐
                    </Typography>
                  }
                />
              </ListItem>
            </Zoom>
          );
        })}
      </TransitionGroup>
    </List>
  );
};

export default UserList;
