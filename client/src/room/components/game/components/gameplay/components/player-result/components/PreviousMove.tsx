import Box from "@mui/material/Box";
import type { MoveType } from "../../../../../../../../types";

type Props = {
  playerMove: MoveType;
};

const PreviousMove = ({ playerMove }: Props) => {
  const allowedMoves = ["rock", "paper", "scissors", "none", "tbd"];
  const tbdIcon = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "30px",
        height: "30px",
        fontSize: "2rem",
      }}
    >
      ?
    </Box>
  );
  const safeMove = allowedMoves.includes(playerMove.move)
    ? playerMove.move
    : false;
  if (!safeMove) return null;
  // Defends against path traversal attacks

  return (
    <Box
      sx={{
        borderRadius: 2,
        p: 0.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: 1,
        border: playerMove.won ? "2px solid" : "2px solid transparent",
        borderColor: playerMove.won
          ? "success.dark"
          : playerMove.move === "tbd"
          ? "#666"
          : "error.main",
      }}
    >
      {safeMove === "tbd" ? (
        tbdIcon
      ) : (
        <img
          src={`/images/icon-${safeMove}.svg`}
          alt={safeMove}
          width={30}
          height={30}
        />
      )}
    </Box>
  );
};

export default PreviousMove;
