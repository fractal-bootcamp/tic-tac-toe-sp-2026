import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";
import "./Cell.css";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());

  useEffect(() => {
    console.log(gameState);
    if (gameState.board && !gameState.board.includes(null)) {
      alert(`draw!`);
      setGameState(createGame());
    }

    const winner = getWinner(gameState);
    if (!winner) return;

    alert(`${winner} wins!`);
    setGameState(createGame());
  }, [gameState]);

  // const getCurrentGame = async () => {
  //   const response = await fetch("/api/game");
  //   // console.log(game);
  //   const game = await response.json();
  //   console.log(game);
  // };

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        const response = await fetch("/api/game"); // your API endpoint
        const data = await response.json();
        setGameState(data);
      } catch (error) {
        console.error("Failed to fetch game state:", error);
        // Fallback to default state
        setGameState({
          board: ["X", "O", null, null, null, null, null, null, null],
          currentPlayer: "X",
        });
      }
    };

    fetchGameState();
  }, []);

  const makeMoveRequest = async (prev: number, index: number) => {
    console.log("doing");
    try {
      const response = await fetch("/api/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prev,
          index,
        }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      const data = await response.json();
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    makeMoveRequest(6, 6);
  }, []);

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      <div>Noughts & Crosses</div>
      {gameState.board && (
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
                        {cell ?? ""}
                      </td>
                    );
                  })}
              </tr>
            ))}
          </tbody>
        </table>
      )}

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
