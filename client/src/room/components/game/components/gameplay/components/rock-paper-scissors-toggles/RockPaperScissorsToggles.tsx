import Box from "@mui/material/Box";
import type {
  RockPaperScissor,
  RoundHistoryType,
} from "../../../../../../../types";
import { useEffect, useState, memo, useCallback } from "react";
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
    [handleSubmitChoice],
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
        backgroundColor: { xs: "background.paper", sm: "transparent" },
        borderTop: { xs: "1px solid", sm: "none" },
        zIndex: 1,
        bottom: 0,
        justifyContent: "center",
        gap: { xs: 2, md: 6 },
        alignItems: "center",
        width: "100%",
        height: "auto",
        minHeight: "140px",
        pt: 2,
        pb: 2,
      }}
    >
      {!display &&
        Array.from({ length: 3 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              width: { xs: "80px", sm: "100px" },
              height: { xs: "80px", sm: "100px" },
              borderRadius: "50%",
              border: "4px dashed",
              borderColor: "text.disabled",
              opacity: 0.2,
            }}
          />
        ))}
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
