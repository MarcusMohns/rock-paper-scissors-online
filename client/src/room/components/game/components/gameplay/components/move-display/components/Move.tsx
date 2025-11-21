import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { UserType } from "../../../../../../../../types";
import Zoom from "@mui/material/Zoom";
import { memo } from "react";

type Props = {
  playerChoice: string;
  player: UserType;
  delay: string;
};

const allowedChoices = ["rock", "paper", "scissors"];

const Move = ({ playerChoice, player, delay }: Props) => {
  const safeChoice = allowedChoices.includes(playerChoice)
    ? playerChoice
    : "none";
  // Defends against path traversal attacks
  return (
    <Zoom
      in={true}
      style={{
        transitionDelay: delay,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "primary.main",
          borderRadius: 2,
          boxShadow: 2,
          minWidth: "150px",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "120px",
          }}
        >
          {player.name}
        </Typography>
        <img
          src={`/images/icon-${safeChoice}.svg`}
          alt={`${player.name} chose ${safeChoice}`} // More descriptive
          width={50}
          height={50}
          role="img"
          aria-label={`${player.name}'s choice: ${safeChoice}`}
        />
        <Typography variant="overline">{safeChoice}</Typography>
      </Box>
    </Zoom>
  );
};

export default memo(Move);
