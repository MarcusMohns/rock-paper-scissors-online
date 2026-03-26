import { useState } from "react";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { gamesSocket } from "../../../../../../socketio/socket";
import { useError } from "../../../../../../hooks/useError";
import type {
  SetSocketDataResponse,
  StatusType,
} from "../../../../../../types";
import ToastAlert from "../../../../../../components/ToastAlert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type Props = {
  gameName: string;
  inGame: boolean;
  gameStatus: StatusType;
  handleConcede: () => void;
};

const LeaveGameButton = ({ gameName, gameStatus, handleConcede }: Props) => {
  const { error, handleSetError } = useError();
  const [openLeaveConfirm, setOpenLeaveConfirm] = useState(false);

  const handleOpenConfirm = () => setOpenLeaveConfirm(true);
  const handleCloseConfirm = () => setOpenLeaveConfirm(false);

  const emitLeaveGame = () => {
    gamesSocket.emit(
      "leaveAllGames",
      gameName,
      (response: SetSocketDataResponse) => {
        if (response.status !== "ok") {
          handleSetError({ status: true, message: response.status });
        }
      },
    );
  };

  const handleLeaveGameAction = () => {
    if (gameStatus === "playing") {
      handleOpenConfirm();
      return;
    }
    emitLeaveGame();
  };

  const onConfirmLeave = () => {
    handleConcede();
    emitLeaveGame();
    handleCloseConfirm();
  };

  return (
    <>
      <Button
        variant="contained"
        color="info"
        startIcon={<LogoutIcon />}
        onClick={handleLeaveGameAction}
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
        Leave Seat
      </Button>

      <Dialog open={openLeaveConfirm} onClose={handleCloseConfirm}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Leave Game?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Leaving the seat during an active game will count as a loss. Are you
            sure?
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
            onClick={onConfirmLeave}
            color="error"
            variant="contained"
            sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 2 }}
          >
            Leave & Forfeit
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

export default LeaveGameButton;
