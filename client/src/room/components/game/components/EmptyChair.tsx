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
        backgroundColor: "primary.main",
        p: 2,
        border: "2px solid",
        borderColor: "primary.dark",
        borderRadius: 2,
        width: { xs: "150px", sm: "250px" },
        height: { xs: "100px", sm: "75px" },
      }}
    >
      <Fade in={true}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            height: { xs: "100px", sm: "75px" },
          }}
        >
          <ChairAltIcon fontSize="large" />
          <Typography>Open</Typography>
        </Box>
      </Fade>
    </Box>
  );
};

export default EmptyChair;
