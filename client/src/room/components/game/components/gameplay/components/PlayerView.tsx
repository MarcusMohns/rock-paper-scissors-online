import GameFinishedAlert from "./game-finished-alert/GameFinishedAlert";
import StartGameButton from "./start-game-button/StartGameButton";
import MoveDisplay from "./move-display/MoveDisplay";
import Countdown from "./Countdown";
import type {
  GameStateType,
  UserType,
  RoundHistoryType,
  PlayersType,
} from "../../../../../../types";

type Props = {
  gameState: GameStateType;
  user: UserType;
  showIngameCountdown: boolean;
  handleStartGame: (gameName: string) => void;
  gameName: string;
  handleEndRound: () => void;
  previousRound: RoundHistoryType;
  players: PlayersType;
  isPlayer1: boolean;
};

const PlayerView = ({
  gameState,
  user,
  showIngameCountdown,
  handleStartGame,
  gameName,
  handleEndRound,
  previousRound,
  players,
  isPlayer1,
}: Props) => {
  return (
    <>
      {gameState.status === "finished" && (
        <GameFinishedAlert
          gameState={gameState}
          userId={user.id}
          userRating={user.stats.rating}
        />
      )}
      {!showIngameCountdown && gameState.status === "waiting" && (
        // If game hasnt started and there's no countdown
        <StartGameButton
          handleStartGame={handleStartGame}
          gameName={gameName}
        />
      )}

      {showIngameCountdown && gameState.status === "playing" ? (
        // Game is starting (countdown is running)
        <Countdown handleEndRound={handleEndRound} />
      ) : (
        previousRound &&
        !showIngameCountdown && (
          // Game has started and a round has been played
          <MoveDisplay
            round={previousRound}
            players={players}
            isPlayer1={isPlayer1}
          />
        )
      )}
    </>
  );
};

export default PlayerView;
