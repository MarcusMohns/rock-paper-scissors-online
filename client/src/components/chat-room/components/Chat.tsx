import { useRef, useEffect } from "react";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { TransitionGroup } from "react-transition-group";
import Message from "./Message.tsx";
import type { MessageType } from "../../../types";
import { Typography } from "@mui/material";

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
      }}
    >
      <TransitionGroup>
        {chat.length > 0 ? (
          chat.map((chatMessage, index) => (
            <Grow in key={index}>
              <Box sx={{ width: "100%", px: 1 }}>
                <Message chatMessage={chatMessage} />
              </Box>
            </Grow>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
              width: "100%",
            }}
          >
            <Typography
              variant="overline"
              sx={{
                fontWeight: "bold",
                color: "text.secondary",
                bgcolor: "action.hover",
                px: 3,
                py: 1,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                boxShadow: 1,
              }}
            >
              No messages yet
            </Typography>
          </Box>
        )}
      </TransitionGroup>
    </List>
  );
};

export default Chat;
