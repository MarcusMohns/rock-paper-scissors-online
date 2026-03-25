import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import UserAvatar from "../../../../../../components/UserAvatar";
import type { GameStateType } from "../../../../../../types";

type Props = {
  gameState: GameStateType;
};
const GameFinishedDisplay = ({ gameState }: Props) => {
  return (
    <Zoom in>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Game has ended
        </Typography>
        {gameState.winner && gameState.winner !== "draw" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "max-content",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                gap: 1,
                p: 1,
                px: 2,
                borderRadius: 4,
                boxShadow: 2,
              }}
            >
              <UserAvatar user={gameState.winner} size={40} />
              <Typography
                sx={{
                  maxWidth: "230px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: "bold",
                }}
              >
                {gameState.winner.name}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              won!
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6" color="text.secondary">
            in a draw
          </Typography>
        )}
      </Box>
    </Zoom>
  );
};

export default GameFinishedDisplay;
