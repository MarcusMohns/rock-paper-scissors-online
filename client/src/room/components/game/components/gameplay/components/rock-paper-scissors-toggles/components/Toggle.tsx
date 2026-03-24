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
          width: { xs: "80px", sm: "120px" },
          height: { xs: "80px", sm: "120px" },
          borderRadius: "50%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border:
            selectedChoice === value
              ? "4px solid #fff"
              : "2px solid transparent",
          boxShadow: selectedChoice === value ? 6 : 3,
          transition: "transform 0.1s",
          "&:active": { transform: "scale(0.95)" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "auto",
            borderRadius: 1,
            justifyContent: "center",
            mb: 0.5,
          }}
        >
          <img
            src={`/images/icon-${value}.svg`}
            alt={value}
            width={40}
            height={40}
          />
        </Box>
        <Typography
          variant="caption"
          fontWeight="bold"
          sx={{ textTransform: "uppercase" }}
        >
          {value}
        </Typography>
      </Button>
    </Zoom>
  );
};

export default Toggle;
