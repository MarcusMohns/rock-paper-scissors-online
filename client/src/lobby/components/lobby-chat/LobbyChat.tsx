import ChatRoom from "../../../components/chat-room/ChatRoom.tsx";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import LobbyUserList from "./LobbyUserList.tsx";
import ForumIcon from "@mui/icons-material/Forum";
import { useChat } from "../../../hooks/useChat.ts";

const LobbyChat = () => {
  const { chat } = useChat();
  return (
    <Paper
      className="lobby-chat"
      elevation={6}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        width: { xs: "100%", lg: "50%" },
        height: "100%",
        p: 3,
        borderRadius: 4,
        boxShadow: 6,
      }}
    >
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
          <ForumIcon color="info" sx={{ fontSize: 30 }} />
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Chat
          </Typography>
        </Box>
        <ChatRoom roomName="lobby" chat={chat} />
      </Stack>
      <LobbyUserList />
    </Paper>
  );
};

export default LobbyChat;
