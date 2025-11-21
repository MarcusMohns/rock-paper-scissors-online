import Button from "@mui/material/Button";
import { useState, useEffect, useCallback } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { socket, gamesSocket } from "../../../../../../../../socketio/socket";
import Zoom from "@mui/material/Zoom";

type Props = {
  handleStartGame: (gameName: string) => void;
  handleSetCountdownActive: (active: boolean) => void;
  gameName: string;
};
const PROGRESS_STEP = 20;
const TOTAL_PROGRESS = 100;

const StartGameCountdown = ({
  handleStartGame,
  handleSetCountdownActive,
  gameName,
}: Props) => {
  const [progress, setProgress] = useState<number>(TOTAL_PROGRESS);

  const startGame = useCallback(() => {
    handleStartGame(gameName);
    handleSetCountdownActive(false);
  }, [handleSetCountdownActive, gameName, handleStartGame]);

  const cancelCountdown = useCallback(() => {
    gamesSocket.emit("cancelGameCountdown", gameName);
    handleSetCountdownActive(false);
  }, [handleSetCountdownActive, gameName]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress > 0) {
        setProgress((prevTime) => prevTime - PROGRESS_STEP);
      }
    }, 1000);

    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, [progress]);

  useEffect(() => {
    socket.on("cancelCountdown", cancelCountdown);

    return () => {
      socket.off("cancelCountdown", cancelCountdown);
    };
  }, [cancelCountdown]);

  useEffect(() => {
    if (progress === 0) {
      startGame();
      handleSetCountdownActive(false);
    }
  }, [progress, handleSetCountdownActive, startGame]);

  return (
    <Zoom in={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          minHeight: "150px",
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CircularProgress
            variant="determinate"
            color={
              progress >= 80 ? "error" : progress >= 40 ? "warning" : "success"
            }
            value={progress}
            size={100}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h4">{progress / PROGRESS_STEP}</Typography>
          </Box>
        </Box>
        <Zoom in={true} timeout={500}>
          <Button
            variant="contained"
            color="error"
            onClick={cancelCountdown}
            disabled={progress < PROGRESS_STEP * 2}
          >
            Cancel
          </Button>
        </Zoom>
      </Box>
    </Zoom>
  );
};

export default StartGameCountdown;
