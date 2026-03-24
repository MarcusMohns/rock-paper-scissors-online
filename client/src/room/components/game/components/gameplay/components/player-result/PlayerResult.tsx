import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { MoveType } from "../../../../../../../types";
import WinCounter from "./components/WinCounter";
import PreviousMove from "./components/PreviousMove";
import { useEffect, useMemo, useState } from "react";
import Zoom from "@mui/material/Zoom";
import Paper from "@mui/material/Paper";

type Props = {
  elementIndex: number;
  isPlayer1: boolean;
  playerName: string | false;
  playerMoves: MoveType[];
  playerScore: number;
  roundQty: number;
};

const PlayerResult = ({
  elementIndex,
  isPlayer1,
  playerName,
  playerMoves,
  playerScore,
  roundQty,
}: Props) => {
  const [transitionPlaying, setTransitionPlaying] = useState(false);

  const previousMoves = useMemo(
    // Return an array of moves corresponding to each round
    () =>
      Array.from({ length: roundQty }, (_, idx) =>
        playerMoves[idx] ? playerMoves[idx] : { move: "tbd", won: false },
      ),
    [playerMoves, roundQty],
  );

  const winCounter = useMemo(
    // Return an array of booleans corresponding to whether each round was won
    () =>
      Array.from({ length: roundQty }, (_, idx) =>
        playerMoves[idx] ? playerMoves[idx].won : null,
      ),
    [playerMoves, roundQty],
  );

  useEffect(() => {
    // Play a transition when the player score increases
    if (playerScore === 0) return;

    setTransitionPlaying(true);
    const timeout = setTimeout(() => {
      setTransitionPlaying(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [playerScore]);

  return (
    <Paper
      className="player-result"
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "transparent",
        height: "100%",
        width: "95%",
        p: 1,
        px: 3,
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row">
        <Typography
          key={playerScore}
          variant="h2"
          sx={{
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1,
            userSelect: "none",
            color: "text.primary",
          }}
        >
          {playerScore}
        </Typography>
        <Zoom in={transitionPlaying} timeout={200}>
          <Box
            sx={{
              fontSize: 17,
              fontWeight: 900,
            }}
          >
            +1
          </Box>
        </Zoom>
      </Stack>
      <Box
        sx={{
          display: "flex",
          // If this element is on the same side as player 1 (elementIndex 1 when isPlayer1)
          // or on the same side as player 2 (elementIndex 2 when not isPlayer1),
          // reverse the column so the moves sit nearest the board.
          flexDirection:
            elementIndex === (isPlayer1 ? 1 : 2) ? "column-reverse" : "column",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "50%" },
        }}
      >
        <Typography
          variant="subtitle1"
          component="p"
          sx={{
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: 600,
            width: { xs: "50%" },
            userSelect: "none",
            opacity: playerName ? 1 : 0.4,
            color: "text.secondary",
            mb: 1,
          }}
        >
          {playerName ? playerName : "Empty"}
        </Typography>
        <Stack direction="row" spacing={1}>
          {previousMoves.map((playerMove, idx) => (
            <PreviousMove
              key={`previous-move-${elementIndex}-${idx}`}
              playerMove={playerMove}
            />
          ))}
        </Stack>
      </Box>
      <WinCounter winCounter={winCounter} />
    </Paper>
  );
};

export default PlayerResult;
