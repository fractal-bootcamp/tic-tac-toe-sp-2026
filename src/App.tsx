import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
import "./Cell.css";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());

  useEffect(() => {
    if (!gameState.board.includes(null)) {
      alert(`draw!`);
      setGameState(createGame());
    }

    const winner = getWinner(gameState);
    if (!winner) return;

    alert(`${winner} wins!`);
    setGameState(createGame());
  }, [gameState]);

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
                      onClick={() =>
                        setGameState((prev) => makeMove(prev, index))
                      }
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
  // initialGameState = m
  // akeMove(initialGameState, 0);
  return initialGameState;
}

export default App;
