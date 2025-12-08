import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { RockPaperScissor } from "../../../../../../../../types";
import Zoom from "@mui/material/Zoom";

type Props = {
  value: RockPaperScissor;
  selectedChoice: RockPaperScissor;
  handleSelectChoice: (value: RockPaperScissor) => void;
  display: boolean;
  timeout: number;
};

const Toggle = ({
  value,
  selectedChoice,
  handleSelectChoice,
  display,
  timeout,
}: Props) => {
  return (
    <Zoom in={display} timeout={timeout}>
      <Button
        value={value}
        aria-label={value}
        disabled={selectedChoice !== "none"}
        onClick={() => handleSelectChoice(value)}
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
          border:
            selectedChoice === value
              ? "2px solid #666"
              : "2px solid transparent",
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
    </Zoom>
  );
};

export default Toggle;
