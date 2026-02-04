export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

export function getWinner(state: GameState): Player | null {
  const { board } = state;

  const winLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of winLines) {
    if (board && board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export function makeMove(state: GameState, position: number): GameState {
  if (!Number.isInteger(position))
    throw new Error("Position must be an integer");
  if (position < 0 || position > 8)
    throw new Error("Position must be between 0 and 8");
  if (state.board[position] !== null)
    throw new Error("Position is already occupied");
  if (getWinner(state) !== null) throw new Error("Game is already over");

  const newBoard = [...state.board] as Board;
  newBoard[position] = state.currentPlayer;

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
  };
}
