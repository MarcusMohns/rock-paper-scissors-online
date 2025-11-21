import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import type { GameStateType } from "../../../../../../../types";
import Zoom from "@mui/material/Zoom";
import RatingProgressBar from "./components/RatingProgressBar";
import RoundResults from "./components/RoundResults";

type Props = {
  gameState: GameStateType;
  userId: string;
  userRating: number;
};
const GameFinishedAlert = ({ gameState, userId, userRating }: Props) => {
  const winnerId =
    gameState.winner && gameState.winner !== "draw" ? gameState.winner.id : 0;
  const [open, setOpen] = useState(true);
  const oldRating =
    gameState.winner === "draw"
      ? userRating
      : userId === winnerId
      ? userRating - 25
      : userRating + 25;
  const handleClose = () => setOpen(false);
  if (!gameState.winner) return null;
  return (
    <Modal
      disableScrollLock={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="Game-finished-alert"
      aria-describedby="Game-finished-alert-description"
      slotProps={{
        backdrop: {
          timeout: 1000,
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", lg: "600px" },
        }}
      >
        <Zoom
          in={true}
          style={{
            transitionDelay: "1500ms",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              boxShadow: 2,
              borderRadius: 2,
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <Stack
              direction="row"
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                id="modal-modal-title"
                variant="h4"
                component="h2"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {gameState.winner === "draw"
                  ? "Draw!"
                  : gameState.winner.id === userId
                  ? "Victory"
                  : "Defeat"}
              </Typography>
              <Button onClick={handleClose} color="info">
                <CloseIcon />
              </Button>
            </Stack>
            {gameState.winner === "draw" ? (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                variant="h6"
              >
                The game has ended in a draw
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "monospace",
                }}
              >
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  variant="h6"
                >
                  The game has ended.
                  <Zoom
                    in={true}
                    style={{
                      transitionDelay: "1000ms",
                    }}
                  >
                    <Box component="span" sx={{ fontWeight: "bold" }}>
                      {" "}
                      You{" "}
                      {gameState.winner.id === userId ? "won ✨" : "lost 💀"}
                    </Box>
                  </Zoom>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    width: "80%",
                    py: 4,
                  }}
                >
                  <RatingProgressBar
                    winner={gameState.winner.id === userId}
                    oldRating={oldRating}
                    newRating={userRating}
                  />
                  <RoundResults history={gameState.history} userId={userId} />
                </Box>
              </Box>
            )}
          </Box>
        </Zoom>
      </Box>
    </Modal>
  );
};

export default GameFinishedAlert;
