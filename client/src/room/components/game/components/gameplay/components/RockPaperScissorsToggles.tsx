import Box from "@mui/material/Box";
import type {
  RockPaperScissor,
  RoundHistoryType,
} from "../../../../../../types";
import { useEffect, useState, memo } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Zoom from "@mui/material/Zoom";

type Props = {
  display: boolean;
  handleSubmitChoice: (selected: string | null) => void;
  history: RoundHistoryType[];
};

const RockPaperScissorsToggle = ({
  display,
  handleSubmitChoice,
  history,
}: Props) => {
  const [selected, setSelected] = useState<RockPaperScissor>("none");

  const handleRockPaperOrScissor = (rockPaperOrScissor: RockPaperScissor) => {
    setSelected(rockPaperOrScissor);
    handleSubmitChoice(rockPaperOrScissor);
  };

  useEffect(() => {
    // Every time history changes (there is a new round), reset selected
    setSelected("none");
  }, [history]);

  const StyledToggleButton = (value: string) => (
    <Button
      value={value}
      aria-label={value}
      disabled={selected !== "none"}
      onClick={() => handleRockPaperOrScissor(value as RockPaperScissor)}
      name={value}
      color="secondary"
      variant="contained"
      size="large"
      sx={{
        display: display ? "flex" : "none",
        width: { xs: "120px", sm: "150px" },
        px: { xs: 0, sm: 2 },
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: selected === value ? "2px solid #666" : "2px solid transparent",
        boxShadow: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          borderRadius: 1,
          justifyContent: "center",
        }}
      >
        <img
          src={`/images/icon-${value}.svg`}
          alt={value}
          width={30}
          height={30}
        />
      </Box>
      <Typography variant="subtitle2">{value}</Typography>
    </Button>
  );

  return (
    <Box
      aria-label="rock paper scissors"
      sx={{
        display: { xs: display ? "flex" : "none", sm: "flex" },
        position: { xs: "fixed", sm: "static" },
        backgroundColor: { sm: "primary.main", xs: "primary.light" },
        borderTop: "8px solid",
        borderColor: "divider",
        zIndex: 1,
        bottom: 0,
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        height: "100px",
      }}
    >
      {!display && (
        <Typography
          sx={{
            position: "absolute",
            letterSpacing: 3,
            lineHeight: 1.5,
            opacity: 0.1,
            fontWeight: "bold",
            userSelect: "none",
          }}
          fontSize={30}
        >
          CONTROLS
        </Typography>
      )}
      <Zoom in={display} timeout={300}>
        {StyledToggleButton("rock")}
      </Zoom>
      <Zoom in={display} timeout={500}>
        {StyledToggleButton("paper")}
      </Zoom>
      <Zoom in={display} timeout={700}>
        {StyledToggleButton("scissors")}
      </Zoom>
    </Box>
  );
};

export default memo(RockPaperScissorsToggle);
