import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
    const name = event.target.value;
    setDialogInput({ ...dialogInput, roomName: name });
  };

  const handleCreateRoom = async () => {
    const roomName = dialogInput.roomName.trim();
    const response = await createRoom(roomName);
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
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          boxShadow: 2,
          transition: "all 0.2s ease-in-out",
          "&:hover": { boxShadow: 4, transform: "translateY(-1px)" },
          mt: "auto",
          ml: "auto",
          width: "max-content",
        }}
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
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle
          id="create-room-alert"
          sx={{
            fontWeight: "bold",
            backgroundColor: "background.paper",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddCircleRoundedIcon color="success" /> Create a room
          </Box>
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "background.paper",
            minWidth: { xs: "280px", sm: "400px" },
            pt: 1,
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Room Name"
            type="text"
            fullWidth
            color="info"
            variant="outlined"
            value={dialogInput.roomName}
            autoComplete="off"
            error={!dialogInput.roomName && dialogInput.roomName !== ""}
            helperText={
              !dialogInput.roomName
                ? "Required"
                : "Enter a unique name for your battleground"
            }
            onChange={handleOnChange}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions
          sx={{ backgroundColor: "background.paper", p: 2, pt: 0 }}
        >
          <Button
            onClick={handleClose}
            color="inherit"
            sx={{ fontWeight: "bold", textTransform: "none" }}
          >
            Close
          </Button>
          <Button
            onClick={handleCreateRoom}
            autoFocus
            variant="contained"
            color="success"
            disabled={!dialogInput.roomName}
            sx={{ fontWeight: "bold", textTransform: "none", borderRadius: 2 }}
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
