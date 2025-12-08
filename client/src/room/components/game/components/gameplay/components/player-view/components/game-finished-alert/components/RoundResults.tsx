import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Zoom from "@mui/material/Zoom";
import Stack from "@mui/material/Stack";
import type { RoundHistoryType } from "../../../../../../../../../../types";

type Props = {
  history: RoundHistoryType[];
  userId: string;
};

const RoundResults = ({ history, userId }: Props) => {
  if (history.length === 0)
    return (
      <Typography fontSize={16} fontWeight={700}>
        No rounds played.
      </Typography>
    );

  return (
    <Box>
      <Typography fontSize={16} fontWeight={700}>
        Round Results
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          px: 2,
          flexWrap: "wrap",
          alignSelf: "center",
          justifyContent: "flex-start",
        }}
      >
        {history.map((round, index) => {
          return (
            <Zoom
              in={true}
              key={index}
              style={{
                transitionDelay: `${1500 + 400 * index}ms`,
              }}
            >
              <Box key={index}>
                <Typography variant="overline">Round {index + 1}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid",
                    borderColor:
                      round.winner === "draw"
                        ? "info.light"
                        : round.winner && round.winner.id === userId
                        ? "success.dark"
                        : "error.dark",
                    borderRadius: "5px",
                    boxShadow: 2,
                    p: 1,
                    mx: 1,
                  }}
                >
                  <Stack
                    direction="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img
                      src={`images/icon-${round.player1Choice}.svg`}
                      alt={round.player1Choice}
                      height={"40px"}
                      width={"40px"}
                    />
                    vs
                    <img
                      src={`images/icon-${round.player2Choice}.svg`}
                      alt={round.player2Choice}
                      height={"40px"}
                      width={"40px"}
                    />
                  </Stack>
                </Box>
              </Box>
            </Zoom>
          );
        })}
      </Box>
    </Box>
  );
};

export default RoundResults;
