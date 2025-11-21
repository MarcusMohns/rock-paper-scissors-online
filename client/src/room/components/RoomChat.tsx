import ChatRoom from "../../components/chat-room/ChatRoom";
import Box from "@mui/material/Box";
import { useChat } from "../../hooks/useChat";

type Props = {
  roomName: string;
};

const RoomChat = ({ roomName }: Props) => {
  const { chat } = useChat();

  return (
    <Box
      className="room-chat"
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: 3,
      }}
    >
      <ChatRoom chat={chat} roomName={roomName} />
    </Box>
  );
};

export default RoomChat;
