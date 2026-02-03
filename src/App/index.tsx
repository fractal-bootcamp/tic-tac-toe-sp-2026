import { useState, useEffect } from "react";
import { createGame, makeMove, getWinner } from "../tic-tac-toe";
import "./index.css";

function getInitialGame() {
  let initialGameState = createGame();
  // initialGameState = makeMove(initialGameState, 3);
  // initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}

function App() {
  let [gameState, setGameState] = useState(getInitialGame());

  const generateBoard = () => {
    return gameState.board.map((cell, index) => {
      return (
        <div
          className="App--cell"
          key={index}
          onClick={() => {
            const newGameState = makeMove(gameState, index);
            setGameState(newGameState);
          }}
        >
          {gameState.board[index]}
        </div>
      );
    });
  };
  useEffect(() => {
    const winner = getWinner(gameState);
    if (winner) {
      alert(`Winner: ${winner}`);
      setGameState(createGame());
    }
  }, [gameState]);

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  // <div>Hello World! current player: {gameState.currentPlayer}</div>;
  return (
    <div className="App--container">
      <div className="App--board">{generateBoard()}</div>
      <div className="App--info">
        <div>Hello World! current player: {gameState.currentPlayer}</div>
      </div>
    </div>
  );
}

export default App;
