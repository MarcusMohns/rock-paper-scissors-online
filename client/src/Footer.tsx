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
        minHeight: "80px",
        width: "100%",
        textAlign: { xs: "center", md: "start" },
        px: { xs: 4, md: 10 },
        py: 4,
        gap: 1,
        mt: "auto",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{
          width: "max-content",
        }}
      >
        Made by @Marcusmohns using SocketIo and React
      </Typography>

      <Typography
        variant="caption"
        color="text.secondary"
        component="p"
        sx={{
          width: "max-content",
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
