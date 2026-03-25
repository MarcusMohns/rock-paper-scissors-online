import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { UserType } from "../../../../../../../../../../types";
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
          backgroundColor: "background.paper",
          borderRadius: 4,
          boxShadow: 4,
          minWidth: "160px",
          p: 2,
          border: "2px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "120px",
            fontWeight: "bold",
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {safeChoice}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
            borderRadius: "50%",
            width: 56,
            height: 56,
            boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={`/images/icon-${safeChoice}.svg`}
            alt={`${player.name} chose ${safeChoice}`}
            width={36}
            height={36}
            role="img"
            aria-label={`${player.name}'s choice: ${safeChoice}`}
          />
        </Box>
      </Box>
    </Zoom>
  );
};

export default memo(Move);
