import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import type { MoveType } from "../../../../../../../../types";
type Props = {
  roundQty: number;
  playerMoves: MoveType[];
};
const WinCounter = ({ roundQty, playerMoves }: Props) => {
  const renderWinBox = (win: boolean | null) => {
    return (
      <Box
        sx={{
          width: 10,
          height: 20,
          borderRadius: 0.5,
          backgroundColor: win === null ? "grey" : win ? "green" : "red",
        }}
      />
    );
  };
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mb: 1,
      }}
    >
      {[...Array(roundQty)].map((_, idx) => {
        const move = playerMoves[idx];
        return (
          <Box key={`wincounter-${idx}`}>
            {renderWinBox(move ? move.won : null)}
          </Box>
        );
      })}
    </Stack>
  );
};

export default WinCounter;
