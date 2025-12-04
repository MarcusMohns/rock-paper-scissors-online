import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import { useState } from "react";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import ToastAlert from "../../../components/ToastAlert";
import { useError } from "../../../hooks/useError";
import type { ErrorType } from "../../../types";
type Props = {
  createRoom: (roomName: string) => Promise<ErrorType | null>;
};

const CreateRoomBtnDialog = ({ createRoom }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInput, setDialogInput] = useState({
    roomName: "",
  });
  const { error, handleSetError } = useError();

  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value.trim();
    setDialogInput({ ...dialogInput, roomName: name });
  };

  const handleCreateRoom = async () => {
    const response = await createRoom(dialogInput.roomName);
    // If theres a response it's an error
    if (response && response.status) {
      // Show error & clear input
      handleSetError({ status: true, message: response.message });
      setDialogInput({ ...dialogInput, roomName: "" });
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        color="success"
        variant="contained"
        sx={{ mt: "auto", ml: "auto", width: "max-content" }}
        size="large"
        endIcon={<AddCircleRoundedIcon />}
      >
        Create Room
      </Button>
      <Dialog
        disableScrollLock={true}
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="create-room-alert"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="create-room-alert">Create a room</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            height: "200px",
            width: "350px",
          }}
        >
          <DialogContentText
            id="create-room-alert-dialog-description"
            component="div"
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Room name"
              type="text"
              fullWidth
              color="info"
              variant="standard"
              value={dialogInput.roomName}
              autoComplete="off"
              error={!dialogInput.roomName}
              helperText={!dialogInput.roomName ? "Room name required" : ""}
              onChange={handleOnChange}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="info">
            Close
          </Button>
          <Button
            onClick={handleCreateRoom}
            autoFocus
            variant="contained"
            color="warning"
            disabled={!dialogInput.roomName}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ ...error, status: false })}
        message={error.message}
        severity="warning"
      />
    </>
  );
};

export default CreateRoomBtnDialog;
