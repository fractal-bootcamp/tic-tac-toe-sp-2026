import { useState } from "react";
import { createGame, makeMove, getWinner } from "./tic-tac-toe";

function App() {
  let [gameState, setGameState] = useState(getInitialGame())

  // console.log the map function over the board
  // gameState.board.map((cell, index) => {
  //   console.log("cell:", cell, "index:", index)
  // })

  // mapping over the board to create table cells
  // gameState.board.map((cell, index) => {
  //   return (
  //     <td onClick={() => setGameState(makeMove(gameState, index))}>{cell || "_"}</td>
  //   )
  // })

  // // // creating a Cell component
  // function Cell() {
  //     gameState.board.map((cell, index) => {
  //   return (
  //     <td onClick={() => setGameState(makeMove(gameState, index))}>{cell || "_"}</td>
  //   )
  //   })
  // }

  // console.log('slice the board', gameState.board.slice(0,3)) // start and end, not inclusive
  // console.log('slice the board', gameState.board.slice(3,6))
  // console.log('slice the board', gameState.board.slice(6,9))

  // const testArray1 = gameState.board.slice(0,3)
  // console.log('test array1', testArray1)

  // const testArray2 = gameState.board.slice(3,6)
  // console.log('test array2', testArray2)

  // const testArray3 = gameState.board.slice(6,9)
  // console.log('test array3', testArray3)

  // const fullArray = [testArray1, testArray2, testArray3]
  // console.log('fullArray', fullArray)


  // Map over JSX simpler - advice from David

  // const easyArray = [0,1,2,3,4,5,6,7,8]

  // return (
  //   <div>
  //     {easyArray.map((num) => (
  //       <div>{num}</div>
  //   ))}
  //   </div>
  // )


  // Trying to map but it's not working yet haha
  function Cell( {cell, index}: { cell: string | null, index: number} ) {
    return (
      <div onClick={() => setGameState(makeMove(gameState, index))}>{cell || "_"}</div>
    )
  }


    return  (
    <>
    <div>
      {gameState.board.map((cell, index) => (
        <Cell 
          key={index}
          cell={cell}
          index={index}
        /> 
      ))}
      </div>

      <div>Current player: {gameState.currentPlayer}</div>
      <div> 
        {getWinner(gameState) &&
          <div>Winner: {getWinner(gameState)}</div>
        }
      </div>
      </>
    )
      
  
  
  // return  (
  //   <>
  //     <table>
  //       <tr>
  //         <td onClick={() => setGameState(makeMove(gameState, 0))}>{gameState.board[0] || "_"}</td>
  //         <td onClick={() => setGameState(makeMove(gameState, 1))}>{gameState.board[1] || "_"}</td>
  //         <td onClick={() => setGameState(makeMove(gameState, 2))}>{gameState.board[2] || "_"}</td>
  //       </tr>
  //       <tr>
  //         <td onClick={() => setGameState(makeMove(gameState, 3))}>{gameState.board[3] || "_"}</td>
  //         <td onClick={() => setGameState(makeMove(gameState, 4))}>{gameState.board[4] || "_"}</td>
  //         <td onClick={() => setGameState(makeMove(gameState, 5))}>{gameState.board[5] || "_"}</td> 
  //       </tr>
  //        <tr>
  //        <td onClick={() => setGameState(makeMove(gameState, 6))}>{gameState.board[6] || "_"}</td>
  //        <td onClick={() => setGameState(makeMove(gameState, 7))}>{gameState.board[7] || "_"}</td>
  //        <td onClick={() => setGameState(makeMove(gameState, 8))}>{gameState.board[8] || "_"}</td>
  //        </tr>
  //     </table>
  //     <div>Current player: {gameState.currentPlayer}</div>
  //     {getWinner(gameState) &&
  //       <div>Winner: {getWinner(gameState)} </div>
  //     }
  //   </>
  // )
  


function getInitialGame() {
  let initialGameState = createGame()
  // initialGameState = makeMove(initialGameState, 3)
  // initialGameState = makeMove(initialGameState, 0)
  return initialGameState
}
}


export default App;
