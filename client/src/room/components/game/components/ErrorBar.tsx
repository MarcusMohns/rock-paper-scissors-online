import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { gamesSocket } from "../../../../socketio/socket";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

const ErrorBar = () => {
  const [reconnectAttempts, setReconnectAttempts] = useState(1);

  useEffect(() => {
    const handleReconnectAttempt = (attempt: number) => {
      setReconnectAttempts(attempt);
    };

    gamesSocket.io.on("reconnect_attempt", handleReconnectAttempt);

    return () => {
      gamesSocket.io.off("reconnect_attempt", handleReconnectAttempt);
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
        <Button
          onClick={() => gamesSocket.connect()}
          size="small"
          color="info"
          variant="text"
          sx={{ textDecoration: "underline" }}
        >
          Manual Reconnect
        </Button>
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

export default ErrorBar;
