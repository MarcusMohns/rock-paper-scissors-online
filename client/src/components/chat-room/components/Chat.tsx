import { useRef, useEffect } from "react";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { TransitionGroup } from "react-transition-group";
import Message from "./Message.tsx";
import type { MessageType } from "../../../types";
import { Typography, alpha } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

type Props = {
  chat: MessageType[];
};

const Chat = ({ chat }: Props) => {
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    // scroll to bottom on new message
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [chat]);

  return (
    <List
      ref={listRef}
      sx={{
        height: "50vh",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "auto",
        mb: 3,
        position: "relative",
      }}
    >
      {chat.length > 0 ? (
        <TransitionGroup>
          {chat.map((chatMessage, index) => (
            <Grow key={index}>
              <Box sx={{ width: "100%", px: 1 }}>
                <Message chatMessage={chatMessage} />
              </Box>
            </Grow>
          ))}
        </TransitionGroup>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            minHeight: "300px",
            width: "100%",
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.05),
            borderRadius: 4,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="overline"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "bold",
              color: "text.secondary",
              px: 3,
              py: 1,
            }}
          >
            <ChatBubbleOutlineIcon fontSize="small" /> No messages yet
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default Chat;
