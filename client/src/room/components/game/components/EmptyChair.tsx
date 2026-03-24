import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ChairAltIcon from "@mui/icons-material/ChairAlt";
import Fade from "@mui/material/Fade";

const EmptyChair = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
        p: 2,
        border: "2px dashed",
        borderColor: "text.disabled",
        borderRadius: 8,
        width: { xs: "150px", sm: "250px" },
        minHeight: { xs: "80px", sm: "90px" },
        color: "text.disabled",
      }}
    >
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <ChairAltIcon fontSize="large" />
          <Typography variant="caption" fontWeight="bold">
            OPEN
          </Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default EmptyChair;
