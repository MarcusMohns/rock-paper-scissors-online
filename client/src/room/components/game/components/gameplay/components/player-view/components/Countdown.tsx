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
      new URL("../../../../../../../../workers/timerWorker.ts", import.meta.url)
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
          minWidth: "250px",
          borderRadius: 2,
          mt: 2,
          p: 1,
        }}
      >
        <Box sx={{ my: 1, width: "100%", textAlign: "center" }}>
          <Zoom in key={word} timeout={400}>
            <Typography variant="h4" key={word}>
              {word}
            </Typography>
          </Zoom>
        </Box>
        <LinearProgress
          sx={{
            p: 0.5,
            width: "75%",
            mx: "auto",
          }}
          variant="determinate"
          value={progress}
          color={
            progress > 60
              ? "primary"
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
