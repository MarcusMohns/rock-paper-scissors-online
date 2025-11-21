import ChatInput from "./components/ChatInput.tsx";
import Chat from "./components/Chat.tsx";
import Box from "@mui/material/Box";
import type { MessageType } from "../../types";

type Props = {
  chat: MessageType[];
  roomName: string;
};

const ChatRoom = ({ roomName, chat }: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        height: "100%",
      }}
    >
      <Chat chat={chat} />
      <ChatInput roomName={roomName} />
    </Box>
  );
};

export default ChatRoom;
