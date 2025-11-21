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
  if (!inGame) return <JoinGameButton gameName={gameName} />;
  else
    return (
      <LeaveGameButton
        gameName={gameName}
        inGame={inGame}
        gameStatus={gameStatus}
        handleConcede={handleConcede}
      />
    );
};

export default memo(JoinOrLeaveButton);
