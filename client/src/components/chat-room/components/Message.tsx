import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import type { MessageType } from "../../../types";
import UserAvatar from "../../UserAvatar";
import Box from "@mui/material/Box";

type Props = {
  chatMessage: MessageType;
};

const Message = ({ chatMessage }: Props) => {
  const dateAndTime = new Date(chatMessage.date).toLocaleTimeString(
    navigator.language,
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  );

  return (
    <ListItem
      sx={{
        bgcolor: "primary.main",
        borderRadius: 3,
        my: 1,
      }}
    >
      <ListItemIcon>
        <UserAvatar user={chatMessage.user} size={40} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: "flex" }}>
            <Typography
              variant="body2"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {chatMessage.user.name} -
            </Typography>
            <Typography fontSize={12} variant="subtitle1">
              {dateAndTime}
            </Typography>
          </Box>
        }
        secondary={
          <Typography
            variant="body1"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              wordBreak: "break-word",
            }}
          >
            {chatMessage.message}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default Message;
