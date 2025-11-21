import { memo } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

const Footer = () => {
  return (
    <Box
      component={"footer"}
      className="footer"
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        height: "100px",
        width: "100%",
        textAlign: { xs: "center", md: "start" },
        backgroundColor: "transparent",
        p: 10,
        gap: 1,
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          boxShadow: { xs: 0, sm: 2 },
          width: "max-content",
          p: { xs: 0, sm: 1 },
          px: { xs: 0, sm: 2 },
          borderRadius: 2,
          backgroundColor: { xs: "none", sm: "background.paper" },
        }}
      >
        Made by @Marcusmohns using SocketIo and React
      </Typography>

      <Typography
        variant="subtitle2"
        sx={{
          boxShadow: { xs: 0, sm: 2 },
          width: "max-content",
          p: { xs: 0, sm: 1 },
          px: { xs: 0, sm: 2 },
          borderRadius: 2,
          backgroundColor: { xs: "none", sm: "background.paper" },
        }}
      >
        Backgrounds by
        <Link
          href="https://bgjar.com"
          variant="body2"
          target="_blank"
          rel="noopener"
          color="inherit"
          sx={{ mx: 0.5 }}
        >
          BGJar
        </Link>
        - Icons by
        <Link
          href="https://icons8.com/"
          variant="body2"
          target="_blank"
          rel="noopener"
          color="inherit"
          sx={{ mx: 0.5 }}
        >
          icons8
        </Link>
        &
        <Link
          href="https://www.svgrepo.com/"
          variant="body2"
          target="_blank"
          rel="noopener"
          color="inherit"
          sx={{ mx: 0.5 }}
        >
          svgrepo
        </Link>
      </Typography>
    </Box>
  );
};

export default memo(Footer);
