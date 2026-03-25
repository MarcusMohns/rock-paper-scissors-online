import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Zoom from "@mui/material/Zoom";

type Props = {
  handleEndRound: () => void;
};

const Countdown = ({ handleEndRound }: Props) => {
  const TIMEOUT_SECONDS = 5;

  const [progress, setProgress] = useState(100);
  const [word, setWord] = useState<
    "Ready?" | "Rock" | "Paper" | "Scissors" | "Shoot!"
  >("Ready?");

  const handleSetWord = (progress: number) => {
    switch (progress) {
      case 60:
        setWord("Rock");
        break;
      case 40:
        setWord("Paper");
        break;
      case 20:
        setWord("Scissors");
        break;
      case 0:
        setWord("Shoot!");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Update word every time progress changes
    handleSetWord(progress);
    // SOmetimes user doesnt reach 0 for some reason.
    if (progress < 0) {
      handleEndRound();
    }
  }, [progress]);

  useEffect(() => {
    // Utilize a worker to handle the countdown logic
    // This is necessary because some browsers suspend the main thread when the tab is inactive
    const worker = new Worker(
      new URL(
        "../../../../../../../../workers/timerWorker.ts",
        import.meta.url,
      ),
    );

    worker.postMessage({
      message: word,
      delay: TIMEOUT_SECONDS,
    });

    worker.onmessage = function (event) {
      const { message, progress } = event.data;
      setWord(message);
      setProgress(progress);
    };

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <Zoom in>
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          my: 4,
        }}
      >
        <Box
          sx={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Zoom in key={word} timeout={400}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: 4,
                color:
                  progress > 60
                    ? "info.main"
                    : progress > 40
                      ? "success.main"
                      : progress > 20
                        ? "warning.main"
                        : "error.main",
                textShadow: "2px 2px 0px rgba(0,0,0,0.1)",
              }}
            >
              {word}
            </Typography>
          </Zoom>
        </Box>
        <LinearProgress
          sx={{
            width: "100%",
            height: 12,
            borderRadius: 6,
            backgroundColor: "action.hover",
          }}
          variant="determinate"
          value={progress}
          color={
            progress > 60
              ? "info"
              : progress > 40
                ? "success"
                : progress > 20
                  ? "warning"
                  : "error"
          }
        />
      </Box>
    </Zoom>
  );
};

export default Countdown;
