import { useState, useEffect } from "react";
import { createGame, getWinner } from "./tic-tac-toe";
import "./App.css"; 

const boardStyle = {
  display: "flex",
  flexWrap: "wrap",
  width: "300px",
  border: "1px solid black"
} as const;

const cellStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100px",
  boxSizing: "border-box",
  border: "1px solid black",
  width: "33.33%",
  textAlign: "center"
} as const;

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  useEffect(() => {
     fetch('http://localhost:3000/api/game', {
      method: 'GET'})
      .then(response => response.json())
      .then(data => setGameState(data)) 
      .catch(error => console.error('Error:', error))
  },[])

  function handleCellClick(index: number){
     //setGameState(makeMove(gameState, index))
     fetch('http://localhost:3000/api/move', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ position: index })
    })
      .then(response => response.json())
      .then(data => setGameState(data)) 
      .catch(error => console.error('Error:', error))
     // console.log('gameState:', gameState) // async - new value not immediately available
  }

  function handleNewGame(){
    fetch('http://localhost:3000/api/game/reset', {
      method: 'POST'})
      .then(response => response.json())
      .then(data => setGameState(data)) 
      .catch(error => console.error('Error:', error))
  }

  function Cell( {cell, index}: { cell: string | null, index: number} ) {
    return (
      <div style={cellStyle} onClick={() => handleCellClick(index)}>
        {cell || " "}
      </div>
    )
  }

  return  (
  <>
  <h1>Tic Tac Toe</h1>
  <div style={boardStyle}>
    {gameState.board.map((cell, index) => (
      <Cell 
        key={index}
        cell={cell}
        index={index}
      /> 
    ))}
    </div>
    
    <div> 
      {getWinner(gameState) ? 
      (<div>Winner: {getWinner(gameState)}</div>) : (<div>Current player: {gameState.currentPlayer}</div>)
      }
    </div>

    <button onClick={()=> handleNewGame()}>Start new game</button>
    </>
  )


// Initial state before fetch completes so component renders something that is then replaced immediately
function getInitialGame() {
  let initialGameState = createGame()
  return initialGameState
}
}

export default App;
