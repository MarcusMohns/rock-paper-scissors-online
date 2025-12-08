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
    [player, winner]
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
    justifyContent: "center",
    backgroundColor: "primary.main",
    p: 2,
    border: "2px solid",
    borderColor: "primary.dark",
    borderRadius: 2,
    width: { xs: "150px", sm: "250px" },
    height: { xs: "100px", sm: "75px" },
  };
  const winnerStyles = {
    ...playerStyles,
    borderColor: "success.light",
  };

  return (
    <Box className="player">
      {playerWon && winnerCrown}
      <Box sx={playerWon ? winnerStyles : playerStyles}>
        <Zoom in={true}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
            }}
          >
            <UserAvatar user={player} size={40} />
            <Stack
              direction="column"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "100px",
                  ml: 1,
                }}
              >
                {player.name}
              </Typography>
              <Zoom in={true}>
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100px",
                    ml: 1,
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
