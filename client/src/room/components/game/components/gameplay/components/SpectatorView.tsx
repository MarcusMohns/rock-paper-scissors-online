import Zoom from "@mui/material/Zoom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { UserType } from "../../../../../../types";
import UserAvatar from "../../../../../../components/UserAvatar";
type Props = {
  status: string;
  winner: UserType | null | "draw";
};
const SpectatorView = ({ status, winner }: Props) => {
  return (
    <div>
      {status === "waiting" && (
        <Zoom in>
          <Typography>Waiting for game to start...</Typography>
        </Zoom>
      )}
      {status === "playing" && (
        <Zoom in>
          <Typography>Game is in progress!</Typography>
        </Zoom>
      )}
      {status === "finished" && winner && (
        <Zoom in>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Game is done!
            {winner === "draw" ? (
              <Typography>It ended in a draw!</Typography>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <UserAvatar user={winner} size={30} />
                {winner.name} won!
              </Box>
            )}
          </Box>
        </Zoom>
      )}
    </div>
  );
};

export default SpectatorView;
