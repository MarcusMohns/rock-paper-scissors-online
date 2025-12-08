import Box from "@mui/material/Box";
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

  return (
    <Zoom
      in
      style={{
        transitionDelay: "800ms",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          m: 2,
        }}
      >
        {round.winner === "draw" ? (
          <Typography fontSize={16}>Draw!</Typography>
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
                  m: 0.2,
                  p: 0.2,
                }}
              >
                <img
                  src={`/images/icon-${round.player1Choice}.svg`}
                  alt={round.player1Choice}
                  width={26}
                  height={26}
                />
              </Box>
              <Typography variant="overline" fontSize={16}>
                beats
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  m: 0.2,
                  p: 0.2,
                }}
              >
                <img
                  src={`/images/icon-${round.player2Choice}.svg`}
                  alt={round.player2Choice}
                  width={26}
                  height={26}
                />
              </Box>
            </Box>
            -
            {user.id === round.winner.id ? (
              <Typography
                fontWeight={900}
                sx={{
                  mx: 0.2,
                }}
              >
                You win!
              </Typography>
            ) : (
              <Typography
                fontWeight={900}
                sx={{
                  display: "flex",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px",
                }}
              >
                {round.winner.name}
                <Typography
                  component="span"
                  fontWeight={900}
                  sx={{
                    mx: 0.2,
                  }}
                >
                  wins
                </Typography>
              </Typography>
            )}
          </>
        )}
      </Box>
    </Zoom>
  );
};

export default RoundResult;
