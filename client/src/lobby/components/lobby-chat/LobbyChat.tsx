import ChatRoom from "../../../components/chat-room/ChatRoom.tsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LobbyUserList from "./LobbyUserList.tsx";
import { useChat } from "../../../hooks/useChat.ts";
const LobbyChat = () => {
  const { chat } = useChat();
  return (
    <Box
      className="lobby-chat"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        width: { xs: "100%", lg: "50%" },
        height: "100%",
        p: 2,
        borderRadius: 2,
        bgcolor: "background.paper",
        boxShadow: 1,
      }}
    >
      <Stack direction="column" sx={{ flexGrow: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Chat
        </Typography>
        <ChatRoom roomName="lobby" chat={chat} />
      </Stack>
      <LobbyUserList />
    </Box>
  );
};

export default LobbyChat;
