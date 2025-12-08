import { useEffect, useState } from "react";
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
      <Typography fontSize={16} fontWeight={700}>
        Rating Change:
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "75%",
          mx: "auto",
        }}
      >
        <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
          <Typography fontSize={14}>
            {oldRating} → {newRating}
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
          <Typography variant="overline">0</Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{ width: "100%", p: 1, mx: 1, boxShadow: 1, borderRadius: 1 }}
            aria-label={`Rating progress: ${Math.round(pct)} percent`}
            color={winner === "draw" ? "info" : winner ? "success" : "error"}
          />
          <Typography variant="overline">2000</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default RatingProgressBar;
