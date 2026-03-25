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
        width: 28,
        height: 28,
        fontSize: "1rem",
        fontWeight: "bold",
        color: "text.disabled",
      }}
    >
      ?
    </Box>
  );

  const safeMove = allowedMoves.includes(playerMove.move)
    ? playerMove.move
    : false;
  if (!safeMove) return null;

  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        border: "2px solid",
        boxShadow: playerMove.move !== "tbd" ? 1 : 0,
        transition: "all 0.2s ease-in-out",
        backgroundColor:
          playerMove.move === "tbd"
            ? "action.hover"
            : playerMove.won
              ? "success.light"
              : "error.light",
        borderColor:
          playerMove.move === "tbd"
            ? "text.disabled"
            : playerMove.won
              ? "success.main"
              : "error.main",
        borderStyle: playerMove.move === "tbd" ? "dashed" : "solid",
      }}
    >
      {safeMove === "tbd" ? (
        tbdIcon
      ) : (
        <img
          src={`/images/icon-${safeMove}.svg`}
          alt={safeMove}
          width={24}
          height={24}
        />
      )}
    </Box>
  );
};

export default PreviousMove;
