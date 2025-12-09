import Box from "@mui/material/Box";
import type {
  RockPaperScissor,
  RoundHistoryType,
} from "../../../../../../../types";
import { useEffect, useState, memo, useCallback } from "react";
import Typography from "@mui/material/Typography";
import Toggle from "./components/Toggle";

type Props = {
  display: boolean;
  handleSubmitChoice: (choice: string | null) => void;
  history: RoundHistoryType[];
};

const RockPaperScissorsToggle = ({
  display,
  handleSubmitChoice,
  history,
}: Props) => {
  const [selectedChoice, setSelectedChoice] =
    useState<RockPaperScissor>("none");

  const handleSelectChoice = useCallback(
    (rockPaperOrScissor: RockPaperScissor) => {
      setSelectedChoice(rockPaperOrScissor);
      handleSubmitChoice(rockPaperOrScissor);
    },
    [handleSubmitChoice]
  );

  useEffect(() => {
    // Every time history changes (there is a new round), reset selected
    setSelectedChoice("none");
  }, [history]);

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
      <Toggle
        selectedChoice={selectedChoice}
        handleSelectChoice={handleSelectChoice}
        display={display}
        value="rock"
        timeout={300}
      />
      <Toggle
        selectedChoice={selectedChoice}
        handleSelectChoice={handleSelectChoice}
        display={display}
        value="paper"
        timeout={500}
      />
      <Toggle
        selectedChoice={selectedChoice}
        handleSelectChoice={handleSelectChoice}
        display={display}
        value="scissors"
        timeout={700}
      />
    </Box>
  );
};

export default memo(RockPaperScissorsToggle);
