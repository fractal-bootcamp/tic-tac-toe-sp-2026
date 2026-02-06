import type { GameState } from "../tic-tac-toe";

import GameBoardView from "./GameBoardView";

import "../Cell.css";

type GameListProps = {
  games: GameState[];
  onGameSelect: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  resetGame: (gameId: string) => void;
  newGame: () => void;
};

export default function GameList({
  games,
  onGameSelect,
  deleteGame,
  resetGame,

  newGame,
}: GameListProps) {
  // TODO: display the gameState, and call `makeMove` when a player clicks a button

  return (
    <>
      <br />
      {games.length === 0 ? (
        <button
          onClick={() => {
            newGame();
          }}
        >
          no games yet. <u>create one</u>
        </button>
      ) : null}
      <div>
        {games.length > 0
          ? games.map((game) => {
              return (
                <div key={game.id} className="gameOption">
                  {game.winner ? `winner was ${game.winner}` : " no winner "}
                  {!game.winner && !game.board.includes(null) && "draw"}
                  <br />
                  <br />
                  <GameBoardView gameBoard={game.board} />
                  <br />
                  <button onClick={() => onGameSelect(game.id)}>play</button>
                  <button onClick={() => deleteGame(game.id)}>delete</button>
                  <button onClick={() => resetGame(game.id)}>reset</button>
                </div>
              );
            })
          : ""}
      </div>
      {games.length !== 0 ? (
        <button
          onClick={() => {
            newGame();
          }}
        >
          start a new game
        </button>
      ) : null}
    </>
  );
}
