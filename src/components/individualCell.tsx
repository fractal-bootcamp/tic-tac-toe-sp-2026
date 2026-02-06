import { type CellIndex, type GameState, type UUID } from "../tic-tac-toe";
import React from "react";

interface IndividualCellProps {
  board_id: UUID;
  currentGameState: GameState;
  index: CellIndex;
  onMove: (index: CellIndex) => Promise<GameState>;
}

export function IndividualCell(props: IndividualCellProps) {
  return (
    <button
      onClick={() => props.onMove(props.index)}
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
          props.currentGameState.board[props.index] !== null
            ? "light-grey"
            : "white",
      }}
    >
      {props.currentGameState.board[props.index]}
    </button>
  );
}
