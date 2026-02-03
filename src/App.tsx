import { useState } from "react";
import { createGame, makeMove } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return  (
    <>
      <table>
        <tr>
          <td>{gameState.board[0] || "_"}</td><td>{gameState.board[1] || "_"}</td><td>{gameState.board[2] || "_"}</td>
        </tr>
        <tr>
          <td>{gameState.board[3] || "_"}</td><td>{gameState.board[4] || "_"}</td><td>{gameState.board[5] || "_"}</td> 
        </tr>
         <tr>
         <td>{gameState.board[6] || "_"}</td><td>{gameState.board[7] || "_"}</td><td>{gameState.board[8] || "_"}</td>
         </tr>
      </table>
      <div>Hello World! current player: {gameState.currentPlayer}</div>
    </>
  )
  
}

function getInitialGame() {
  let initialGameState = createGame()
  initialGameState = makeMove(initialGameState, 3)
  initialGameState = makeMove(initialGameState, 0)
  return initialGameState
}

export default App;
