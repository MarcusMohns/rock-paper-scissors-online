import List from "@mui/material/List";
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
    <List className="user-list">
      {userList.length === 0 && <Typography>No users</Typography>}
      <TransitionGroup>
        {userList.map((user) => {
          return (
            <Zoom key={user.id}>
              <ListItem>
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
                      }}
                    >
                      {user.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" fontSize={12}>
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
