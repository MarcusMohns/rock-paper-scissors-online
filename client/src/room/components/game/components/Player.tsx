import Typography from "@mui/material/Typography";
import type { UserType } from "../../../../types";
import UserAvatar from "../../../../components/UserAvatar";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { useMemo } from "react";

type Props = {
  player: UserType;
  winner: UserType | null | "draw";
};

const Player = ({ player, winner }: Props) => {
  const playerWon = useMemo(
    () => winner && winner !== "draw" && player.id === winner.id,
    [player, winner],
  );
  const winnerCrown = (
    <Zoom in={true}>
      <Box sx={{ position: "absolute", width: { xs: "120px", sm: "200px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            width: "100%",
            position: "relative",
            bottom: 26,
          }}
        >
          <img
            src="images/crown.png"
            alt="crown"
            width="32"
            height="32"
            aria-hidden
          />
        </Box>
      </Box>
    </Zoom>
  );
  const playerStyles = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "primary.main",
    p: 2,
    boxShadow: 3,
    borderRadius: 8,
    width: { xs: "150px", sm: "250px" },
    height: "auto",
    minHeight: { xs: "80px", sm: "90px" },
    border: "2px solid transparent",
  };
  const winnerStyles = {
    ...playerStyles,
    borderColor: "#4caf50",
    boxShadow: 6,
  };

  return (
    <Box className="player">
      {playerWon && winnerCrown}
      <Box sx={playerWon ? winnerStyles : playerStyles}>
        <Zoom in={true}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              gap: 1,
            }}
          >
            <UserAvatar user={player} size={36} />
            <Stack
              direction="column"
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: { xs: "80px", sm: "140px" },
                }}
              >
                {player.name}
              </Typography>
              <Zoom in={true}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {player.stats.rating} ⭐
                </Typography>
              </Zoom>
            </Stack>
          </Box>
        </Zoom>
      </Box>
    </Box>
  );
};

export default Player;
