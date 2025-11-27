import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Players from "./components/Players";
import { useEffect } from "react";
import JoinOrLeaveButton from "./components/join-or-leave-button/JoinOrLeaveButton";
import ActionButtons from "./components/ActionButtons";
import Gameplay from "./components/gameplay/Gameplay";
import CombatLog from "./components/gameplay/components/CombatLog";
import { useGame } from "../../../hooks/use-game/useGame";
import ToastAlert from "../../../components/ToastAlert";
import ErrorBar from "./components/ErrorBar";
type Props = {
  gameName: string;
  inGame: boolean;
  handleSetInGame: (inGame: boolean) => void;
};

const Game = ({ gameName, inGame, handleSetInGame }: Props) => {
  const {
    game,
    user,
    handleConcede,
    error,
    handleSetError,
    handleEndGame,
    handleSetGameState,
    isConnected,
  } = useGame({
    gameName,
    inGame,
  });

  useEffect(() => {
    const { player1, player2 } = game.players;
    const isInGame = player1?.id === user.id || player2?.id === user.id;
    handleSetInGame(isInGame);
  }, [game.players, user.id, handleSetInGame]);

  return (
    <Box
      className="game"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        minHeight: { xs: "100vh", lg: "80vh" },
        backgroundColor: "background.paper",
        boxShadow: 3,
        borderRadius: 1,
      }}
    >
      <Stack
        className="buttons"
        direction="row"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flexWrap: "wrap",
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
        gap={1}
      >
        <ActionButtons
          gameName={gameName}
          inGame={inGame}
          gameStatus={game.state.status}
          handleConcede={handleConcede}
        />
        <CombatLog log={game.state.combatLog} />
        <JoinOrLeaveButton
          gameName={gameName}
          inGame={inGame}
          gameStatus={game.state.status}
          handleConcede={handleConcede}
        />
      </Stack>
      {isConnected ? null : <ErrorBar />}
      <Box
        className="players-and-board"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
        }}
      >
        <Players players={game.players} winner={game.state.winner} />
        <Gameplay
          gameName={gameName}
          inGame={inGame}
          players={game.players}
          gameState={game.state}
          handleEndGame={handleEndGame}
          handleSetGameState={handleSetGameState}
          previousRound={game.state.history[game.state.history.length - 1]}
          rounds={game.state.rounds}
        />
      </Box>
      {error && (
        <ToastAlert
          open={error.status}
          handleClose={() => handleSetError({ ...error, status: false })}
          message={error.message}
          severity="warning"
        />
      )}
    </Box>
  );
};

export default Game;
