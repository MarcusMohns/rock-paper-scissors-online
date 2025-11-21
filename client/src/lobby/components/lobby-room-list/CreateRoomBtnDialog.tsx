import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import { useCallback, useState } from "react";
import type { RoomResponseType } from "../../../types";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import { socket } from "../../../socketio/socket";
import { useError } from "../../../hooks/useError";
import ToastAlert from "../../../components/ToastAlert";

type Props = {
  handleSetInRoom: (roomName: string) => void;
};

const CreateRoomBtnDialog = ({ handleSetInRoom }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInput, setDialogInput] = useState({
    roomName: "",
  });
  const { error, handleSetError } = useError();

  const createRoom = useCallback(
    (roomName: string) => {
      if (!roomName) return;
      socket.emit("createRoom", roomName, (response: RoomResponseType) => {
        if (response.status === "ok") {
          handleSetInRoom(response.roomName);
        } else {
          handleSetError({ status: true, message: response.status });
        }
      });
    },
    [handleSetInRoom, handleSetError]
  );

  const handleClickOpen = () => {
    setDialogOpen(true);
  };
  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDialogInput({ ...dialogInput, roomName: event.target.value });
    if (error.message === "Room already exists") {
      handleSetError({ ...error, status: false });
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
            onClick={() => createRoom(dialogInput.roomName)}
            autoFocus
            variant="contained"
            color="warning"
            disabled={!dialogInput.roomName || error.status}
          >
            Create
          </Button>
        </DialogActions>
        <ToastAlert
          message={error.message}
          open={error.status}
          handleClose={() => handleSetError({ ...error, status: false })}
          severity="warning"
        />
      </Dialog>
    </>
  );
};

export default CreateRoomBtnDialog;
