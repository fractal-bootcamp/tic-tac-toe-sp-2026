import { useState } from "react";
import {
  createGame,
  makeMove,
  getWinner,
  type CellIndex,
  type GameState,
} from "./tic-tac-toe";
import "./App.css";

function App() {
  let [gameState, setGameState] = useState(getInitialGame());

  function handleCellClick(cellIndex: CellIndex) {
    const newGameState = makeMove(gameState, cellIndex);
    setGameState(newGameState);
  }

  function IndividualCell(props: { index: CellIndex }) {
    return (
      <button
        onClick={() => handleCellClick(props.index)}
        style={{
          width: "100%",
          aspectRatio: 1,
          borderTop: [0, 1, 2].includes(props.index)
            ? "1px solid white"
            : "1px solid black",
          borderBottom: [6, 7, 8].includes(props.index)
            ? "1px solid white"
            : "1px solid black",
          borderRight: [2, 5, 8].includes(props.index)
            ? "1px solid white"
            : "1px solid black",
          borderLeft: [0, 3, 6].includes(props.index)
            ? "1px solid white"
            : "1px solid black",
          backgroundColor:
            gameState.board[props.index] !== null ? "light-grey" : "white",
        }}
      >
        {gameState.board[props.index]}
      </button>
    );
  }

  function WinnerDisplay() {
    let winner = getWinner(gameState);
    if (winner !== null) {
      return <h1>{winner} Wins!!!!</h1>;
    } else {
      return <h1></h1>;
    }
  }

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1> Tic, Tac, Toe</h1>
        <br />
        current player: {gameState.currentPlayer}
        <br />
      </div>
      <div
        style={{
          display: "grid",
          width: "100%",
          gap: "0px",
          margin: "o auto",
          padding: "0px",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "min(500px,80vh)",
          margin: "0 auto",
          gridTemplateColumns: "repeat(3,1fr)",
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <IndividualCell key={i} index={i as CellIndex} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <WinnerDisplay />
      </div>
    </>
  );
}

function getInitialGame() {
  let initialGameState = createGame();
  return initialGameState;
}

// Create a 'cell' component

export type CellProps = {
  cellIndex: CellIndex;
  gameState: GameState;
  onClick: () => void;
};

export default App;
