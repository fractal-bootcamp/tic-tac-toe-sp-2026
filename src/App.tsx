import { useState } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(createGame())

  const winner = getWinner(gameState);

  const handleCellClick = (position: number) => {
    if (gameState.board[position] !== null || winner !== null) {
      return;
    }

    try {
      const newGameState = makeMove(gameState, position);
      setGameState(newGameState);
    } catch (error) {
      console.error(error);
    }
  };

  const resetGame = () => {
    setGameState(createGame());
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Tic Tac Toe</h1>

      {winner ? (
        <h2>Winner: {winner}!</h2>
      ) : (
        <h2>Current Player: {gameState.currentPlayer}</h2>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 100px)',
        gridTemplateRows: 'repeat(3, 100px)',
        gap: '2px',
        margin: '20px auto',
        width: 'fit-content'
      }}>
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              width: '100px',
              height: '100px',
              fontSize: '24px',
              backgroundColor: cell ? '#f0f0f0' : 'white',
              border: '1px solid #ccc',
              cursor: cell || winner ? 'not-allowed' : 'pointer'
            }}
            disabled={cell !== null || winner !== null}
          >
            {cell}
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px'
        }}
      >
        New Game
      </button>
    </div>
  );
}

export default App;
