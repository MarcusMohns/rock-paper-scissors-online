import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import LobbyRoom from "./LobbyRoom";
import Grow from "@mui/material/Grow";
import { TransitionGroup } from "react-transition-group";
import CreateRoomBtnDialog from "./CreateRoomBtnDialog";
import useRoomList from "../../../hooks/useRoomList";

type Props = {
  handleSetInRoom: (room: string) => void;
};

const LobbyRoomList = ({ handleSetInRoom }: Props) => {
  const { roomList } = useRoomList("lobby");
  return (
    <Box
      className="lobby-rooms"
      sx={{
        width: { xs: "100%", lg: "40%" },
        height: "100%",
        minHeight: "70vh",
        p: 2,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.paper",
        gap: 2,
        boxShadow: 1,
      }}
    >
      <Stack sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Rooms
        </Typography>
        <CreateRoomBtnDialog handleSetInRoom={handleSetInRoom} />
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TransitionGroup>
          {roomList.map((room) => (
            <Grow in key={room.name}>
              <Box sx={{ height: "100%", mb: 1 }}>
                <LobbyRoom handleSetInRoom={handleSetInRoom} room={room} />
              </Box>
            </Grow>
          ))}
        </TransitionGroup>
      </Box>
    </Box>
  );
};

export default LobbyRoomList;
