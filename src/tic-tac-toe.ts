export type Player = "X" | "O";
export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8

// TYPES
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type Piece = "X";
export type GameState = {
  board: Board;
  currentPlayer: Player;
};

// FUNCTIONS
export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

export function makeMove(state: GameState, position: number): GameState {
  const newBoard = [...state.board] as Board;

  if (newBoard[position] !== null) {
    alert("nah fam");
    return {
      board: newBoard,
      currentPlayer: state.currentPlayer,
    };
  }
  newBoard[position] = state.currentPlayer;

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
  };
}

export function getWinner(state: GameState): Player | null {
  const piece = state.currentPlayer;
  const board = state.board;
  const dirs = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < dirs.length; i++) {
    const path = dirs[i];
    const first = board[path[0]];
    if (first !== null && path.every((pathIdx) => board[pathIdx] === first)) {
      return first;
    }
  }
  return null;
}
