import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LobbyRoom from "./LobbyRoom";
import Zoom from "@mui/material/Zoom";
import Paper from "@mui/material/Paper";
import { TransitionGroup } from "react-transition-group";
import CreateRoomBtnDialog from "./CreateRoomBtnDialog";
import useRoomList from "../../../hooks/useRoomList";
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
      elevation={3}
      sx={{
        width: { xs: "100%", lg: "40%" },
        height: "100%",
        minHeight: "70vh",
        p: 3,
        borderRadius: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Rooms
        </Typography>
        <CreateRoomBtnDialog createRoom={createRoom} />
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TransitionGroup>
          {roomList.map((room) => (
            <Zoom in key={room.name}>
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
