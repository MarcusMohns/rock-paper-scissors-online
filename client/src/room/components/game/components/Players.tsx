import Stack from "@mui/material/Stack";
import Player from "./Player";
import type { PlayersType, UserType } from "../../../../types";
import Fade from "@mui/material/Fade";
import EmptyChair from "./EmptyChair";
type Props = {
  players: PlayersType;
  winner: UserType | "draw" | null;
};

const Players = ({ players, winner }: Props) => {
  const { player1, player2 } = players;
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
        {player1 ? <Player player={player1} winner={winner} /> : <EmptyChair />}
        <img
          src={"images/icon-vs.svg"}
          alt="VS"
          width="50"
          height="50"
          aria-hidden
        />
        {player2 ? <Player player={player2} winner={winner} /> : <EmptyChair />}
      </Stack>
    </Fade>
  );
};

export default Players;
