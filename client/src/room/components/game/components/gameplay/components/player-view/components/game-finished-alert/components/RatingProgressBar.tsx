import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { Zoom } from "@mui/material";

type Props = {
  winner: boolean | "draw";
  oldRating: number;
  newRating: number;
};

const RatingProgressBar = ({ winner, oldRating, newRating }: Props) => {
  const [rating, setRating] = useState(oldRating);
  const diff = newRating - oldRating;

  useEffect(() => {
    // Update rating slowly
    const timeout = setTimeout(() => {
      setRating(newRating);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [newRating]);

  const pct = Math.min(100, Math.max(0, (rating / 2000) * 100));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        mt: 2,
        mb: 2,
        width: "100%",
        position: "relative",
      }}
    >
      {/* Hidden live region for screen readers to announce rating changes */}
      <Typography
        component="span"
        aria-live="polite"
        role="status"
        sx={{
          position: "absolute",
          left: -9999,
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        {`Rating: ${rating}`}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "80%",
          mx: "auto",
        }}
      >
        <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, mb: 2, textAlign: "center" }}
          >
            {oldRating} → {newRating}
            <Box
              component="span"
              sx={{
                ml: 2,
                fontSize: "1.2rem",
                verticalAlign: "middle",
                p: 0.5,
                borderRadius: 1,
                bgcolor: alpha(diff >= 0 ? "#4caf50" : "#f44336", 0.1),
                color:
                  diff > 0
                    ? "success.main"
                    : diff < 0
                      ? "error.main"
                      : "info.main",
              }}
            >
              ({diff >= 0 ? `+${diff}` : diff})
            </Box>
          </Typography>
        </Zoom>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "text.disabled" }}
          >
            0
          </Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              width: "100%",
              height: 14,
              mx: 2,
              borderRadius: 7,
              "& .MuiLinearProgress-bar": {
                borderRadius: 7,
                boxShadow: (theme) =>
                  `0 0 10px ${winner === "draw" ? theme.palette.info.main : winner ? theme.palette.success.main : theme.palette.error.main}`,
              },
            }}
            aria-label={`Rating progress: ${Math.round(pct)} percent`}
            color={winner === "draw" ? "info" : winner ? "success" : "error"}
          />
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "text.disabled" }}
          >
            2000
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RatingProgressBar;
