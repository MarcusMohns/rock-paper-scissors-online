import Button from "@mui/material/Button";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import { gamesSocket } from "../../../../../../socketio/socket";
import { useError } from "../../../../../../hooks/useError";
import ToastAlert from "../../../../../../components/ToastAlert";
import { useCallback } from "react";

type Props = {
  gameName: string;
};

const JoinGameButton = ({ gameName }: Props) => {
  const { error, handleSetError } = useError();

  const handleJoinGame = useCallback(() => {
    gamesSocket.emit(
      "createOrJoinGame",
      gameName,
      (response: { status: string }) => {
        if (response.status !== "ok") {
          handleSetError({ status: true, message: response.status });
        }
      },
    );
  }, [gameName, handleSetError]);

  return (
    <>
      <Button
        variant="contained"
        color="success"
        disabled={error.status}
        startIcon={<SportsEsportsIcon />}
        onClick={handleJoinGame}
        size="small"
        sx={{
          fontWeight: "bold",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          boxShadow: 2,
          transition: "all 0.2s ease-in-out",
        }}
      >
        Join Game
      </Button>
      {error && (
        <ToastAlert
          open={error.status}
          handleClose={() => handleSetError({ status: false, message: "" })}
          message={error.message}
          severity="error"
        />
      )}
    </>
  );
};

export default JoinGameButton;
