import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import type { GameStateType } from "../../../../../../../../../types";
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

  const isWinner = gameState.winner !== "draw" && userId === winnerId;
  const isDraw = gameState.winner === "draw";

  const oldRating = isDraw
    ? userRating
    : isWinner
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
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.7)",
          },
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
              p: 5,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 4,
              maxHeight: "80vh",
              border: "1px solid",
              borderColor: "divider",
              borderTop: "8px solid",
              borderTopColor: isDraw
                ? "info.main"
                : isWinner
                  ? "success.main"
                  : "error.main",
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
                  fontWeight: 900,
                  textTransform: "uppercase",
                  fontSize: "2.5rem",
                  letterSpacing: 2,
                  color: isDraw
                    ? "info.main"
                    : isWinner
                      ? "success.main"
                      : "error.main",
                }}
              >
                {isDraw ? "Draw!" : isWinner ? "Victory" : "Defeat"}
              </Typography>
              <Button
                onClick={handleClose}
                color="inherit"
                sx={{ minWidth: "auto" }}
              >
                <CloseIcon />
              </Button>
            </Stack>
            {gameState.winner === "draw" ? (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2, textAlign: "center", color: "text.secondary" }}
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
                }}
              >
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                  variant="subtitle1"
                >
                  The game has ended.
                  <Zoom
                    in={true}
                    style={{
                      transitionDelay: "1000ms",
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 900,
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        color: isWinner ? "success.main" : "error.main",
                      }}
                    >
                      {" "}
                      You {isWinner ? "won ✨" : "lost 💀"}
                    </Box>
                  </Zoom>
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    pt: 2,
                    pb: 4,
                    gap: 3,
                  }}
                >
                  <RatingProgressBar
                    winner={isDraw ? "draw" : isWinner}
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
