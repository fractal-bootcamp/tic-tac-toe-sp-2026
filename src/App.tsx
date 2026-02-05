import { useState, useEffect } from "react";
import {
  getWinner,
  type CellIndex,
  type GameState,
  createGame,
} from "./tic-tac-toe";
import "./App.css";

function App() {
  const [gameState, setGameState] = useState(createGame()); // Start with null

  async function createNewGame() {
    try {
      const res = await fetch("/api/createNewGame", {
        method: "POST",
      });
      const json = await res.json();
      setGameState(json);
      console.log("creatednewgame");
    } catch (err) {
      console.error(err);
    }
  }

  async function move(index: CellIndex) {
    try {
      const res = await fetch("/api/move", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          index: index,
        }),
      });
      const json = await res.json();
      setGameState(json);
      console.log("moved player");
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log("creating new game!");
    console.log(gameState);
    createNewGame();
  }, []);

  function IndividualCell(props: { index: CellIndex }) {
    return (
      <button
        onClick={() => move(props.index)}
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
    if (gameState.winner !== null) {
      return <h1>{gameState.winner} Wins!!!!</h1>;
    } else {
      return <h1></h1>;
    }
  }

  if (!gameState) {
    return "Loading";
  } else {
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
}

// Create a 'cell' component

export type CellProps = {
  cellIndex: CellIndex;
  gameState: GameState;
  onClick: () => void;
};

export default App;
