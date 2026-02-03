
import { makeMove } from "./tic-tac-toe"
import type { GameState } from "./tic-tac-toe"
type BoardProps = {
  gameState: GameState
  setGameState: (state: GameState) => void
}
export const Board = (props: BoardProps) => {
  const handleClick = (position: number): void => {
    props.setGameState(makeMove(props.gameState, position))
  }
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <button
              disabled={props.gameState.board[0] ? true : false}
              onClick={() => handleClick(0)}>{props.gameState.board[0]
                ? props.gameState.board[0]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[1] ? true : false}
              onClick={() => handleClick(1)}>{props.gameState.board[1]
                ? props.gameState.board[1]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[2] ? true : false}
              onClick={() => handleClick(2)}>{props.gameState.board[2]
                ? props.gameState.board[2]
                : "_"
              }</button>
          </td>
        </tr>
        <tr>
          <td>
            <button
              disabled={props.gameState.board[3] ? true : false}
              onClick={() => handleClick(3)}>{props.gameState.board[3]
                ? props.gameState.board[3]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[4] ? true : false}
              onClick={() => handleClick(4)}>{props.gameState.board[4]
                ? props.gameState.board[4]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[5] ? true : false}
              onClick={() => handleClick(5)}>{props.gameState.board[5]
                ? props.gameState.board[5]
                : "_"
              }</button>
          </td>
        </tr>
        <tr>
          <td>
            <button
              disabled={props.gameState.board[6] ? true : false}
              onClick={() => handleClick(6)}>{props.gameState.board[6]
                ? props.gameState.board[6]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[7] ? true : false}
              onClick={() => handleClick(7)}>{props.gameState.board[7]
                ? props.gameState.board[7]
                : "_"
              }</button>
          </td>
          <td>
            <button
              disabled={props.gameState.board[8] ? true : false}
              onClick={() => handleClick(8)}>{props.gameState.board[8]
                ? props.gameState.board[8]
                : "_"
              }</button>
          </td>
        </tr>
      </tbody>
    </table>
  )
}