import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
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
        }}
      >
        Game has ended
        {gameState.winner && gameState.winner !== "draw" ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                borderRadius: 4,
              }}
            >
              <UserAvatar user={gameState.winner} size={40} />
              <Box
                sx={{
                  maxWidth: "230px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {gameState.winner.name}
              </Box>
            </Box>
            won!
          </Box>
        ) : (
          "in a draw"
        )}
      </Box>
    </Zoom>
  );
};

export default GameFinishedDisplay;
