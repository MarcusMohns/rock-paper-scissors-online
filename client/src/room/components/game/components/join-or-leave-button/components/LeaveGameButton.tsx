import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { gamesSocket } from "../../../../../../socketio/socket";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
type Props = {
  gameName: string;
  inGame: boolean;
  gameStatus: "waiting" | "playing" | "finished";
  handleConcede: () => void;
};

const LeaveGameButton = ({
  gameName,
  inGame,
  gameStatus,
  handleConcede,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const leaveGame = (gameName: string) => {
    gamesSocket.emit("leaveAllGames", gameName);
  };

  const leaveAndLoseGame = (gameName: string) => {
    gamesSocket.emit("leaveAllGames", gameName);
    handleConcede();
  };

  const handleClickOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box
      sx={{
        ml: { xs: "0px", sm: "auto" },
      }}
    >
      <Dialog
        onClose={handleCloseDialog}
        open={dialogOpen}
        disableScrollLock={true}
      >
        <DialogTitle>Are you sure you want to leave the game?</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2">You will concede the game</Typography>
          <DialogActions>
            <Button
              variant="contained"
              color="success"
              onClick={() => leaveAndLoseGame(gameName)}
              size="large"
            >
              Yes
            </Button>

            <Button
              variant="contained"
              color="success"
              onClick={handleCloseDialog}
              size="large"
            >
              No
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Button
        variant="contained"
        color="secondary"
        endIcon={<CloseIcon />}
        onClick={
          inGame && gameStatus === "playing"
            ? handleClickOpenDialog
            : () => leaveGame(gameName)
        }
        size="medium"
        sx={{ px: { xs: 1, sm: 2 } }}
      >
        Leave Game
      </Button>
    </Box>
  );
};

export default LeaveGameButton;
