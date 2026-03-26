import { Box } from "@mui/material";
import JoinGameButton from "./components/JoinGameButton";
import LeaveGameButton from "./components/LeaveGameButton";
import { memo } from "react";

type Props = {
  gameName: string;
  inGame: boolean;
  gameStatus: "waiting" | "playing" | "finished";
  handleConcede: () => void;
};

const JoinOrLeaveButton = ({
  gameName,
  inGame,
  gameStatus,
  handleConcede,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ml: { xs: 0, sm: "auto" },
      }}
    >
      {!inGame ? (
        <JoinGameButton gameName={gameName} />
      ) : (
        <LeaveGameButton
          gameName={gameName}
          inGame={inGame}
          gameStatus={gameStatus}
          handleConcede={handleConcede}
        />
      )}
    </Box>
  );
};

export default memo(JoinOrLeaveButton);
