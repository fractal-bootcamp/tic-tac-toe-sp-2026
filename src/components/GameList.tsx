import type { GameState } from "../tic-tac-toe";

import "../Cell.css";

type GameListProps = {
  games: GameState[];
  onGameSelect: (gameId: string) => void;
};

export default function GameList({ games, onGameSelect }: GameListProps) {
  // TODO: display the gameState, and call `makeMove` when a player clicks a button

  return (
    <div>
      {games.length > 0
        ? games.map((game) => {
            return (
              <div
                key={game.id}
                className="gameOption"
                onClick={() => onGameSelect(game.id)}
              >
                {game.id}
                {game.winner ? game.winner : " nowinner "}
                {game.currentPlayer}

                {!game.winner && !game.board.includes(null) && "draw"}
              </div>
            );
          })
        : ""}
    </div>
  );
}
