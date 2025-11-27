import Stack from "@mui/material/Stack";
import type { RoundHistoryType, PlayersType } from "../../../../../../../types";
import Move from "./components/Move";
import RoundResult from "./components/RoundResult";
type Props = {
  round: RoundHistoryType;
  players: PlayersType;
  isPlayer1: boolean;
};

const MoveDisplay = ({ round, players, isPlayer1 }: Props) => {
  if (players.player1 === null || players.player2 === null) return null;
  const player1Won =
    round.winner === "draw" ? false : round.winner.id === players.player1.id;

  return (
    <Stack
      direction={isPlayer1 ? "column-reverse" : "column"}
      // Make sure the our move is closest to us on the board
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <Move
        player={players.player1}
        playerChoice={round.player1Choice}
        delay={isPlayer1 ? "0ms" : "500ms"}
      />
      {round && round.winner && (
        <RoundResult round={round} players={players} player1Won={player1Won} />
      )}
      <Move
        player={players.player2}
        playerChoice={round.player2Choice}
        delay={isPlayer1 ? "500ms" : "0ms"}
      />
    </Stack>
  );
};

export default MoveDisplay;
