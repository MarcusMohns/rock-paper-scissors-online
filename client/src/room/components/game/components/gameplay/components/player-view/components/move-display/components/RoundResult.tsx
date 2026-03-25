import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";
import type {
  RoundHistoryType,
  PlayersType,
} from "../../../../../../../../../../types";
import { useContext } from "react";
import { UserContext } from "../../../../../../../../../../Context";

type Props = {
  round: RoundHistoryType;
  players: PlayersType;
  player1Won: boolean;
};
const RoundResult = ({ round, players, player1Won }: Props) => {
  const { user } = useContext(UserContext);
  if (!players.player1 || !players.player2 || !round.winner) return null;

  const isWinner = round.winner !== "draw" && user.id === round.winner.id;
  const isDraw = round.winner === "draw";
  return (
    <Zoom
      in
      style={{
        transitionDelay: "800ms",
      }}
    >
      <Box
        sx={(theme) => ({
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          my: 2,
          px: 1,
          py: 0.5,
          borderRadius: 10,
          backgroundColor: isDraw
            ? theme.palette.action.hover
            : isWinner
              ? alpha(theme.palette.success.main, 0.15)
              : alpha(theme.palette.error.main, 0.15),
          border: "1px solid",
          borderColor: isDraw
            ? theme.palette.divider
            : isWinner
              ? theme.palette.success.main
              : theme.palette.error.main,
          boxShadow: 1,
          width: "fit-content",
        })}
      >
        {isDraw ? (
          <Typography variant="h6" fontWeight="bold" color="text.secondary">
            Draw!
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: player1Won ? "row" : "row-reverse",
                alignItems: "center",
                height: "max-content",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  py: 0.25,
                }}
              >
                <img
                  src={`/images/icon-${round.player1Choice}.svg`}
                  alt={round.player1Choice}
                  width={24}
                  height={24}
                />
              </Box>
              <Typography
                variant="overline"
                fontWeight="bold"
                sx={{ color: "text.secondary", fontSize: "0.75rem", mx: 1 }}
              >
                beats
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  py: 0.25,
                }}
              >
                <img
                  src={`/images/icon-${round.player2Choice}.svg`}
                  alt={round.player2Choice}
                  width={24}
                  height={24}
                />
              </Box>
            </Box>
            <Typography sx={{ mx: 1.5, fontWeight: "bold" }}>—</Typography>
            {isWinner ? (
              <Typography
                variant="subtitle1"
                fontWeight="900"
                sx={{ color: "success.main" }}
              >
                You win!
              </Typography>
            ) : (
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: "error.main",
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {round.winner !== "draw" && round.winner.name}
                <Box component="span" sx={{ ml: 0.5, fontWeight: "900" }}>
                  wins
                </Box>
              </Typography>
            )}
          </>
        )}
      </Box>
    </Zoom>
  );
};

export default RoundResult;
