import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { gamesSocket } from "../../../../../../socketio/socket";
import { useCallback } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useError } from "../../../../../../hooks/useError";
import ToastAlert from "../../../../../../components/ToastAlert";

type Props = {
  gameName: string;
};

const JoinGameButton = ({ gameName }: Props) => {
  const { error, handleSetError } = useError();

  const joinGame = useCallback(() => {
    gamesSocket.emit(
      "createOrJoinGame",
      gameName,
      (response: { status: string }) => {
        if (response.status !== "ok") {
          handleSetError({ status: true, message: response.status });
        }
      }
    );
  }, [gameName, handleSetError]);

  return (
    <Box
      sx={{
        ml: { xs: "0px", sm: "auto" },
      }}
    >
      <Button
        variant="contained"
        color="success"
        disabled={error.status}
        onClick={joinGame}
        size="medium"
        endIcon={<ArrowDownwardIcon />}
        sx={{ px: { xs: 1, sm: 2 } }}
      >
        Join Game
      </Button>
      <ToastAlert
        open={error.status}
        handleClose={() => handleSetError({ ...error, status: false })}
        message={error.message}
        severity="warning"
      />
    </Box>
  );
};

export default JoinGameButton;
