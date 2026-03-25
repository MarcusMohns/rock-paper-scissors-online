import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
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
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 1.5,
          width: "100%",
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
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: "text.disabled",
                    mb: 0.5,
                  }}
                >
                  ROUND {index + 1}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: (theme) =>
                      round.winner === "draw"
                        ? alpha(theme.palette.info.main, 0.1)
                        : round.winner && round.winner.id === userId
                          ? alpha(theme.palette.success.main, 0.15)
                          : alpha(theme.palette.error.main, 0.15),
                    border: "1px solid",
                    borderColor: (theme) =>
                      round.winner === "draw"
                        ? theme.palette.info.main
                        : round.winner && round.winner.id === userId
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    borderRadius: 2,
                    p: 1,
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
                      src={`/images/icon-${round.player1Choice}.svg`}
                      alt={round.player1Choice}
                      height={"32px"}
                      width={"32px"}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        mx: 1,
                        fontWeight: 900,
                        color: "text.disabled",
                        fontSize: "0.65rem",
                      }}
                    >
                      VS
                    </Typography>
                    <img
                      src={`/images/icon-${round.player2Choice}.svg`}
                      alt={round.player2Choice}
                      height={"32px"}
                      width={"32px"}
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
