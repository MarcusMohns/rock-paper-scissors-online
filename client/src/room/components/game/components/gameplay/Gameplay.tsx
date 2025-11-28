import Box from "@mui/material/Box";
import RockPaperScissorsToggle from "./components/RockPaperScissorsToggles";
import type {
  GameStateType,
  RoundType,
  PlayersType,
  RoundHistoryType,
  GameType,
} from "../../../../../types";
import PlayerResult from "./components/player-result/PlayerResult";
import Fade from "@mui/material/Fade";
import { useGameplay } from "../../../../../hooks/use-gameplay/useGameplay";
import ToastAlert from "../../../../../components/ToastAlert";
import SpectatorView from "./components/SpectatorView";
import PlayerView from "./components/PlayerView";
import GameFinishedDisplay from "./components/GameFinishedDisplay";

type Props = {
  gameName: string;
  inGame: boolean;
  players: PlayersType;
  gameState: GameStateType;
  handleSetGameState: (gameState: GameStateType) => void;
  handleEndGame: (
    outcome: "win" | "loss" | "draw",
    game: GameStateType
  ) => void;
  previousRound: RoundHistoryType;
  rounds: RoundType[];
};
const Gameplay = ({
  gameName,
  inGame,
  players,
  gameState,
  previousRound,
  handleSetGameState,
  handleEndGame,
  rounds,
}: Props) => {
  const {
    showIngameCountdown,
    player1,
    player2,
    isPlayer1,
    user,
    error,
    handleSetError,
    handleStartGame,
    handleEndRound,
    handleSubmitChoice,
  } = useGameplay({
    gameName,
    gameState,
    players,
    rounds,
    handleSetGameState,
    handleEndGame,
  });

  return (
    <Box
      className="gameplay"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        mt: 3,
      }}
    >
      <Fade in timeout={1500}>
        <Box
          className="gameplay-container"
          sx={{
            display: "flex",
            flexDirection: isPlayer1 ? "column-reverse" : "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <PlayerResult
            elementIndex={1}
            isPlayer1={isPlayer1}
            playerName={players.player1 ? players.player1.name : false}
            playerMoves={player1.moves}
            playerScore={player1.score}
            roundQty={rounds.length}
          />
          <Box
            className="gameplay-board"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              minHeight: "400px",
              width: "100%",
            }}
          >
            {inGame ? (
              // If we are a player ingame
              <PlayerView
                gameState={gameState}
                user={user}
                showIngameCountdown={showIngameCountdown}
                gameName={gameName}
                handleEndRound={handleEndRound}
                handleStartGame={handleStartGame}
                previousRound={previousRound}
                players={players}
                isPlayer1={isPlayer1}
              />
            ) : (
              // If we are a spectator
              <SpectatorView
                status={gameState.status}
                winner={gameState.winner}
              />
            )}
            {gameState.status === "finished" && previousRound === undefined && (
              // If game has ended and there's no previous round (i.e conceded round 1)
              <GameFinishedDisplay gameState={gameState} />
            )}
          </Box>
          <PlayerResult
            elementIndex={2}
            isPlayer1={isPlayer1}
            playerName={players.player2 ? players.player2.name : false}
            playerMoves={player2.moves}
            playerScore={player2.score}
            roundQty={rounds.length}
          />
        </Box>
      </Fade>
      <RockPaperScissorsToggle
        display={inGame && gameState.status === "playing"}
        handleSubmitChoice={handleSubmitChoice}
        history={gameState.history}
      />
      {error && (
        <ToastAlert
          open={error.status}
          handleClose={() => handleSetError({ ...error, status: false })}
          message={error.message}
          severity="error"
        />
      )}
    </Box>
  );
};

export default Gameplay;
