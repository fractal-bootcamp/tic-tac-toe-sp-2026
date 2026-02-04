import { useState, useEffect } from "react";
import { createGame, getWinner } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";
import "./Cell.css";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());

  const restartGame = async () => {
    try {
      const response = await fetch("/api/restart", {
        method: "POST",
      });

      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error("Failed to make move:", error);
    }
  };

  const getGameState = async () => {
    const response = await fetch("/api/game");
    const data = await response.json();
    // !gameState.board.includes(null) ? restartGame() : setGameState(data);
    setGameState(data);
  };

  const makeMove = async (gState: GameState, index: number) => {
    try {
      const response = await fetch("/api/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gState, index }),
      });

      const data = await response.json();
      setGameState(data);
    } catch (error) {
      console.error("Failed to make move:", error);
    }
  };

  useEffect(() => {
    const winner = getWinner(gameState);

    // no winner, draw
    if (!winner && !gameState.board.includes(null)) {
      alert(`draw!`);
      restartGame();
      return;
    }

    // no winner
    if (!winner) return;

    // winner
    if (winner) {
      alert(`${winner} wins!`);
      restartGame();
      return;
    }
  }, [gameState]);

  useEffect(() => {
    getGameState();
  }, []);

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      <div>Noughts & Crosses</div>
      <table className="board">
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row}>
              {gameState.board
                .slice(row * 3, row * 3 + 3)
                .map((cell, colIndex) => {
                  const index = row * 3 + colIndex;
                  return (
                    <td
                      key={index}
                      className={cell ? "filled" : ""}
                      onClick={() => makeMove(gameState, index)}
                    >
                      {" "}
                      {cell ?? ""}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
      <div>Hello World! current player: {gameState.currentPlayer}</div>
    </div>
  );
}

function getInitialGame() {
  let initialGameState = createGame();
  // initialGameState = makeMove(initialGameState, 3);
  // initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}

export default App;
