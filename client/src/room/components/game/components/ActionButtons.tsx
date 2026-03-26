import { useState } from "react";
import Button from "@mui/material/Button";
import { gamesSocket } from "../../../../socketio/socket";
import Stack from "@mui/material/Stack";
import type { StatusType, SetSocketDataResponse } from "../../../../types";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useError } from "../../../../hooks/useError";
import ToastAlert from "../../../../components/ToastAlert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  gameStatus: StatusType;
  gameName: string;
  inGame: boolean;
  handleConcede: () => void;
};

const ActionButtons = ({
  gameStatus,
  gameName,
  inGame,
  handleConcede,
}: Props) => {
  const { error, handleSetError } = useError();
  const [openConcedeConfirm, setOpenConcedeConfirm] = useState(false);

  const handleOpenConfirm = () => setOpenConcedeConfirm(true);
  const handleCloseConfirm = () => setOpenConcedeConfirm(false);

  const onConfirmConcede = () => {
    handleConcede();
    handleCloseConfirm();
  };

  const handleResetGame = (gameName: string) => {
    gamesSocket.emit(
      "resetGame",
      gameName,
      (response: SetSocketDataResponse) => {
        if (response.status !== "ok") {
          handleSetError({ status: true, message: response.status });
        }
      },
    );
  };
  return (
    <>
      <Stack direction="row" spacing={1.5}>
        <Button
          onClick={handleOpenConfirm}
          variant="contained"
          color="error"
          startIcon={<EmojiFlagsIcon />}
          disabled={gameStatus !== "playing" || !inGame}
          size="small"
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            boxShadow: 2,
            transition: "all 0.2s ease-in-out",
          }}
        >
          Give up
        </Button>
        <Button
          onClick={() => handleResetGame(gameName)}
          variant="contained"
          color="warning"
          startIcon={<RestartAltIcon />}
          disabled={gameStatus !== "finished" || !inGame}
          size="small"
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            boxShadow: 2,
            transition: "all 0.2s ease-in-out",
          }}
        >
          Reset
        </Button>
      </Stack>
      <Dialog open={openConcedeConfirm} onClose={handleCloseConfirm}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Surrender?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to give up? This will count as a loss.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseConfirm}
            color="inherit"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirmConcede}
            color="error"
            variant="contained"
            sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 2 }}
          >
            Give up
          </Button>
        </DialogActions>
      </Dialog>
      {error && (
        <ToastAlert
          open={error.status}
          handleClose={() => handleSetError({ status: false, message: "" })}
          message={error.message}
          severity="error"
        />
      )}
    </>
  );
};

export default ActionButtons;
