import ChatRoom from "../../../components/chat-room/ChatRoom.tsx";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LobbyUserList from "./LobbyUserList.tsx";
import { useChat } from "../../../hooks/useChat.ts";
const LobbyChat = () => {
  const { chat } = useChat();
  return (
    <Paper
      className="lobby-chat"
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        width: { xs: "100%", lg: "50%" },
        height: "100%",
        p: 3,
        borderRadius: 4,
      }}
    >
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Chat
        </Typography>
        <ChatRoom roomName="lobby" chat={chat} />
      </Stack>
      <LobbyUserList />
    </Paper>
  );
};

export default LobbyChat;
