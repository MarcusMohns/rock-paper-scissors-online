import Stack from "@mui/material/Stack";
import Player from "./Player";
import type { PlayersType, UserType } from "../../../../types";
import { memo } from "react";
import Fade from "@mui/material/Fade";
type Props = {
  players: PlayersType;
  winner: UserType | "draw" | null;
};

const Players = ({ players, winner }: Props) => {
  const isUser = (w: UserType | "draw" | null): w is UserType =>
    w !== null && w !== "draw";

  const player1Won = isUser(winner) && players.player1?.id === winner.id;
  const player2Won = isUser(winner) && players.player2?.id === winner.id;
  return (
    <Fade in={true} timeout={800}>
      <Stack
        className="players"
        direction="row"
        spacing={{ xs: 3, md: 10 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: { xs: 6, md: 3 },
        }}
      >
        <Player player={players.player1} winner={player1Won} />
        <img
          src={"images/icon-vs.svg"}
          alt="VS"
          width="50"
          height="50"
          aria-hidden
        />
        <Player player={players.player2} winner={player2Won} />
      </Stack>
    </Fade>
  );
};

export default memo(Players);
