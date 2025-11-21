import Button from "@mui/material/Button";
import { gamesSocket } from "../../../../socketio/socket";
import Stack from "@mui/material/Stack";
import type { StatusType, SetSocketDataResponse } from "../../../../types";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useError } from "../../../../hooks/useError";
import ToastAlert from "../../../../components/ToastAlert";
type Props = {
  gameStatus: StatusType;
  gameName: string;
  inGame: boolean;
  handleConcede: () => void;
};

const ActionButtons = ({
  gameStatus,
  gameName,
  inGame,
  handleConcede,
}: Props) => {
  const { error, handleSetError } = useError();
  const handleResetGame = (gameName: string) => {
    gamesSocket.emit(
      "resetGame",
      gameName,
      (response: SetSocketDataResponse) => {
        if (response.status !== "ok") {
          handleSetError({ status: true, message: response.status });
        }
      }
    );
  };
  return (
    <>
      <Stack direction="row" gap={1}>
        <Button
          onClick={handleConcede}
          variant="contained"
          color="error"
          startIcon={<EmojiFlagsIcon />}
          disabled={gameStatus !== "playing" || inGame === false}
          size="small"
        >
          Give up
        </Button>
        <Button
          onClick={() => handleResetGame(gameName)}
          variant="contained"
          color="warning"
          startIcon={<RestartAltIcon />}
          disabled={gameStatus !== "finished" || inGame === false}
          size="small"
        >
          Reset
        </Button>
      </Stack>
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

export default ActionButtons;
