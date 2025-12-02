import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { socket } from "./socketio/socket.ts";
import Fade from "@mui/material/Fade";

const InfoBar = () => {
  const [reconnectAttempts, setReconnectAttempts] = useState(1);

  useEffect(() => {
    const handleReconnectAttempt = (attempt: number) => {
      setReconnectAttempts(attempt);
    };

    socket.io.on("reconnect_attempt", handleReconnectAttempt);

    return () => {
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
    };
  }, []);

  return (
    <Fade in>
      <Box
        className="info-bar"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "error.light",
          width: "100%",
        }}
      >
        <Typography variant="subtitle2">
          Disconnected! Attempting to connect - (Attempt {reconnectAttempts})
        </Typography>
        <CircularProgress
          disableShrink
          size={16}
          color="inherit"
          sx={{ ml: 1 }}
        />
      </Box>
    </Fade>
  );
};

export default InfoBar;
