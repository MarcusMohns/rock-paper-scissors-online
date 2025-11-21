import Button from "@mui/material/Button";
import { useCallback, useState, useEffect } from "react";
import type { ResponseType } from "../../../../../../../types";
import { gamesSocket } from "../../../../../../../socketio/socket";
import Box from "@mui/material/Box";
import StartGameCountdown from "./components/StartGameCountdown";
import Zoom from "@mui/material/Zoom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useError } from "../../../../../../../hooks/useError";
import ToastAlert from "../../../../../../../components/ToastAlert";

type Props = {
  handleStartGame: (gameName: string) => void;
  gameName: string;
};
const StartGameButton = ({ gameName, handleStartGame }: Props) => {
  const [countdownActive, setCountdownActive] = useState(false);
  const { error, handleSetError } = useError();

  const handleSetCountdownActive = useCallback((active: boolean) => {
    setCountdownActive(active);
  }, []);

  const startCountdownHandler = useCallback(() => {
    // Called when Start Game btn is clicked OR when startCountdown emit is received
    handleSetCountdownActive(true);
  }, [handleSetCountdownActive]);

  const startGameCountdown = useCallback(
    (roomName: string) => {
      gamesSocket.emit(
        "startGameCountdown",
        roomName,
        (response: ResponseType) => {
          if (response.status === "ok") {
            startCountdownHandler();
          } else {
            handleSetError({ status: true, message: response.status });
          }
        }
      );
    },
    [handleSetError, startCountdownHandler]
  );

  useEffect(() => {
    gamesSocket.on("startCountdown", startCountdownHandler);
    return () => {
      gamesSocket.off("startCountdown", startCountdownHandler);
    };
  }, [startCountdownHandler]);

  return (
    <>
      <Zoom in={true}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {countdownActive ? (
            <StartGameCountdown
              handleStartGame={handleStartGame}
              handleSetCountdownActive={handleSetCountdownActive}
              gameName={gameName}
            />
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => startGameCountdown(gameName)}
              endIcon={<PlayArrowIcon />}
              size="large"
              disabled={error.status}
            >
              Start Game
            </Button>
          )}
        </Box>
      </Zoom>
      <ToastAlert
        open={error.status}
        message={error.message}
        handleClose={() => handleSetError({ ...error, status: false })}
        severity="warning"
      />
    </>
  );
};

export default StartGameButton;
