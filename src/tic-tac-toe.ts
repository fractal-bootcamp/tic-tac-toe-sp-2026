export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type GameId = string;
export type Winner = Player | null;

export type GameState = {
  board: Board;
  currentPlayer: Player;
  id: GameId;
  winner: Winner;
};

// export const createDatabase = (): GameDatabase => new Map();

export function createGame(id: string = crypto.randomUUID()): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    id,
    winner: null,
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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      console.log("getting winner");
      console.log(board[a]);
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

  const potentialWinner = getWinner({
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    id: state.id,
    winner: state.winner,
  });

  return {
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    id: state.id,
    winner: potentialWinner,
  };
}
