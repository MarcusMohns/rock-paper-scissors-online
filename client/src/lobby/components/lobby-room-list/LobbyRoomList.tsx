import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LobbyRoom from "./LobbyRoom";
import Zoom from "@mui/material/Zoom";
import Paper from "@mui/material/Paper";
import { TransitionGroup } from "react-transition-group";
import CreateRoomBtnDialog from "./CreateRoomBtnDialog";
import useRoomList from "../../../hooks/useRoomList";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import type { ErrorType } from "../../../types";

type Props = {
  joinRoom: (roomName: string) => Promise<ErrorType | null>;
  createRoom: (roomName: string) => Promise<ErrorType | null>;
};

const LobbyRoomList = ({ joinRoom, createRoom }: Props) => {
  const { roomList } = useRoomList("lobby");
  return (
    <Paper
      className="lobby-rooms"
      elevation={6}
      sx={{
        width: { xs: "100%", lg: "40%" },
        height: "100%",
        minHeight: "70vh",
        p: 3,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        boxShadow: 6,
      }}
    >
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
        <MeetingRoomIcon color="info" sx={{ fontSize: 30 }} />
        <Stack
          direction="row"
          spacing={2}
          sx={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Rooms
          </Typography>
          <CreateRoomBtnDialog createRoom={createRoom} />
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TransitionGroup>
          {roomList.map((room) => (
            <Zoom key={room.name}>
              <Box sx={{ height: "100%", mb: 1 }}>
                <LobbyRoom joinRoom={joinRoom} room={room} />
              </Box>
            </Zoom>
          ))}
        </TransitionGroup>
      </Box>
    </Paper>
  );
};

export default LobbyRoomList;
