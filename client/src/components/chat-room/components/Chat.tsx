import { useRef, useEffect } from "react";
import Grow from "@mui/material/Grow";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import { TransitionGroup } from "react-transition-group";
import Message from "./Message.tsx";
import type { MessageType } from "../../../types";

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
        {chat.map((chatMessage, index) => (
          <Grow in key={index}>
            <Box sx={{ width: "100%" }}>
              <Message chatMessage={chatMessage} />
            </Box>
          </Grow>
        ))}
      </TransitionGroup>
    </List>
  );
};

export default Chat;
