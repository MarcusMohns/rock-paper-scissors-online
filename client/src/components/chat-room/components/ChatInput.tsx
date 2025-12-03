import React, { useState, useContext } from "react";
import { socket } from "../../../socketio/socket";
import { UserContext } from "../../../Context";
import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import { useError } from "../../../hooks/useError";
import ToastAlert from "../../ToastAlert";

type Props = {
  roomName: string;
};

const ChatInput = ({ roomName }: Props) => {
  const { user } = useContext(UserContext);
  const { error, handleSetError } = useError();
  const MAX_LEN = 255;

  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsLoading(true);

    const trimmed = value.trim();
    if (trimmed.length > MAX_LEN || !trimmed) {
      if (trimmed.length > MAX_LEN) {
        handleSetError({ status: true, message: "Message too long" });
      } else {
        handleSetError({ status: true, message: "Message cannot be empty" });
      }
      setIsLoading(false);
      setValue("");
      return;
    }
    socket.emit(
      "chatMessage",
      {
        user,
        message: trimmed,
        date: new Date().toUTCString(),
        room: roomName,
      },
      (response: { status: "ok" | "error" }) => {
        if (response.status === "ok") {
          setIsLoading(false);
          handleSetError({ status: false, message: "" });
        } else {
          setIsLoading(false);
          handleSetError({ status: true, message: response.status });
        }
      }
    );
    setValue("");
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: "auto" }}>
      <Input
        spellCheck="false"
        type="text"
        placeholder="Type your message here..."
        disableUnderline
        fullWidth
        inputProps={{ maxLength: MAX_LEN, minLength: 1 }}
        endAdornment={
          <Button
            variant="text"
            type="submit"
            disabled={isLoading}
            color="info"
            size="small"
          >
            Send
          </Button>
        }
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ ...error, status: false })}
        //  We skip clearing the error message intentionally because the text disappears before the Toast alert.
        message={error.message}
        severity="warning"
      />
    </Box>
  );
};

export default ChatInput;
