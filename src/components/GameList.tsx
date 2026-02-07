import { useState } from "react";
import type { GameState, BoardSize } from "../tic-tac-toe";
import GameBoardView from "./GameBoardView";
import "../Cell.css";

type GameListProps = {
  games: GameState[];
  onGameSelect: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  resetGame: (gameId: string) => void;
  newGame: (size: BoardSize) => void;
  selectedSize: BoardSize;
  onSizeChange: (size: BoardSize) => void;
};

const BOARD_SIZES: BoardSize[] = [1, 2, 3, 4, 5, 6, 7];

export default function GameList({
  games,
  onGameSelect,
  deleteGame,
  resetGame,
  newGame,
  selectedSize,
  onSizeChange,
}: GameListProps) {
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = (gameId: string) => {
    setDeletingIds((prev) => new Set(prev).add(gameId));
    setTimeout(() => {
      deleteGame(gameId);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(gameId);
        return next;
      });
    }, 300);
  };
  return (
    <>
      <br />
      <div style={{ marginBottom: "10px" }}>
        <label>Board size: </label>
        <select
          value={selectedSize}
          onChange={(e) => onSizeChange(Number(e.target.value) as BoardSize)}
        >
          {BOARD_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}x{size}
            </option>
          ))}
        </select>
      </div>
      {games.length === 0 ? (
        <button onClick={() => newGame(selectedSize)}>
          no games yet. <u>create one</u>
        </button>
      ) : null}
      <div>
        {games.length > 0
          ? games.map((game) => (
              <div key={game.id} className={`gameOption${deletingIds.has(game.id) ? " fade-out" : ""}`}>
                <div style={{ fontSize: "0.8em", color: "#666" }}>{game.boardSize}x{game.boardSize}</div>
                {game.winner ? `winner was ${game.winner}` : " no winner "}
                {!game.winner && !game.board.includes(null) && "draw"}
                <br />
                <br />
                <GameBoardView gameBoard={game.board} boardSize={game.boardSize} />
                <br />
                <button onClick={() => onGameSelect(game.id)}>play</button>
                <button onClick={() => handleDelete(game.id)}>delete</button>
                <button onClick={() => resetGame(game.id)}>reset</button>
              </div>
            ))
          : ""}
      </div>
      {games.length !== 0 ? (
        <button onClick={() => newGame(selectedSize)}>start a new game</button>
      ) : null}
    </>
  );
}
