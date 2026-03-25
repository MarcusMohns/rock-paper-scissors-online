import Button from "@mui/material/Button";
import { useState, useEffect, useCallback } from "react";
import { alpha } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import {
  socket,
  gamesSocket,
} from "../../../../../../../../../../socketio/socket";
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
    // Start game at the end of countdown
    handleStartGame(gameName);
    handleSetCountdownActive(false);
  }, [handleSetCountdownActive, gameName, handleStartGame]);

  const cancelCountdown = useCallback(() => {
    // Cancel countdown for us and emit to the other player to do the same
    gamesSocket.emit("cancelGameCountdown", gameName);
    handleSetCountdownActive(false);
  }, [handleSetCountdownActive, gameName]);

  useEffect(() => {
    // Utilize a worker to handle the timer logic
    // This is necessary because some browsers suspend the main thread when the tab is inactive
    const worker = new Worker(
      new URL(
        "../../../../../../../../../../workers/countdownWorker.ts",
        import.meta.url,
      ),
    );
    worker.postMessage({
      progress: TOTAL_PROGRESS,
      step: PROGRESS_STEP,
    });
    worker.onmessage = function (event) {
      const { total } = event.data;
      setProgress(total);
    };
    return () => {
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (progress === 0) {
      startGame();
      handleSetCountdownActive(false);
    }
  }, [progress, handleSetCountdownActive, startGame]);

  useEffect(() => {
    // Listen for the other player to cancel the countdown
    socket.on("cancelCountdown", cancelCountdown);
    return () => {
      socket.off("cancelCountdown", cancelCountdown);
    };
  }, [cancelCountdown]);

  return (
    <Zoom in={true}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          borderRadius: 4,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.6),
          backdropFilter: "blur(10px)",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: 12,
          minWidth: "220px",
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            variant="determinate"
            color={
              progress >= 80 ? "error" : progress >= 40 ? "warning" : "success"
            }
            value={progress}
            size={120}
            thickness={5}
            sx={{
              filter: "drop-shadow(0 0 8px rgba(0,0,0,0.2))",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                fontFamily: "monospace",
              }}
            >
              {progress / PROGRESS_STEP}
            </Typography>
          </Box>
        </Box>
        <Zoom in={true} timeout={500}>
          <Button
            variant="contained"
            color="error"
            onClick={cancelCountdown}
            disabled={progress < PROGRESS_STEP * 2}
            sx={{
              fontWeight: "bold",
              borderRadius: 2,
              px: 3,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
        </Zoom>
      </Box>
    </Zoom>
  );
};

export default StartGameCountdown;
