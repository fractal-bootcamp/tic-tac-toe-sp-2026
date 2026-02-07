export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = Cell[];
export type GameId = string;
export type Winner = Player | null;
export type BoardSize = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type TakebackRequest = {
  requestedBy: Player;
  pending: boolean;
};

export type GameState = {
  board: Board;
  boardSize: BoardSize;
  currentPlayer: Player;
  id: GameId;
  winner: Winner;
  moveHistory: number[];
  takebackRequest: TakebackRequest | null;
};

/**
 * Generate win lines for a given board size.
 * For 1x1: single cell wins
 * For NxN (N >= 2): all rows, all columns, both diagonals
 */
export function generateWinLines(size: BoardSize): number[][] {
  if (size === 1) {
    return [[0]]; // 1x1: the only cell is a win
  }

  const lines: number[][] = [];

  // Rows
  for (let row = 0; row < size; row++) {
    const line: number[] = [];
    for (let col = 0; col < size; col++) {
      line.push(row * size + col);
    }
    lines.push(line);
  }

  // Columns
  for (let col = 0; col < size; col++) {
    const line: number[] = [];
    for (let row = 0; row < size; row++) {
      line.push(row * size + col);
    }
    lines.push(line);
  }

  // Main diagonal (top-left to bottom-right)
  const mainDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    mainDiag.push(i * size + i);
  }
  lines.push(mainDiag);

  // Anti-diagonal (top-right to bottom-left)
  const antiDiag: number[] = [];
  for (let i = 0; i < size; i++) {
    antiDiag.push(i * size + (size - 1 - i));
  }
  lines.push(antiDiag);

  return lines;
}

export function createGame(id: string = crypto.randomUUID(), size: BoardSize = 3): GameState {
  const totalCells = size * size;
  const board: Board = Array(totalCells).fill(null);

  return {
    board,
    boardSize: size,
    currentPlayer: "X",
    id,
    winner: null,
    moveHistory: [],
    takebackRequest: null,
  };
}

export function getWinner(state: GameState): Player | null {
  const { board, boardSize } = state;
  const winLines = generateWinLines(boardSize);

  for (const line of winLines) {
    const firstCell = board[line[0]];
    if (firstCell && line.every((index) => board[index] === firstCell)) {
      return firstCell;
    }
  }

  return null;
}

export function makeMove(state: GameState, position: number): GameState {
  const maxPosition = state.boardSize * state.boardSize - 1;

  if (!Number.isInteger(position))
    throw new Error("Position must be an integer");
  if (position < 0 || position > maxPosition)
    throw new Error(`Position must be between 0 and ${maxPosition}`);
  if (state.board[position] !== null)
    throw new Error("Position is already occupied");
  if (getWinner(state) !== null) throw new Error("Game is already over");

  const newBoard = [...state.board] as Board;
  newBoard[position] = state.currentPlayer;

  const potentialWinner = getWinner({
    ...state,
    board: newBoard,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
  });

  return {
    board: newBoard,
    boardSize: state.boardSize,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    id: state.id,
    winner: potentialWinner,
    moveHistory: [...state.moveHistory, position],
    takebackRequest: null, // Clear any pending takeback request on new move
  };
}

export function undoLastMove(state: GameState): GameState {
  if (state.moveHistory.length === 0) {
    throw new Error("No moves to undo");
  }

  const lastMove = state.moveHistory[state.moveHistory.length - 1];
  const newBoard = [...state.board] as Board;
  newBoard[lastMove] = null;

  return {
    board: newBoard,
    boardSize: state.boardSize,
    currentPlayer: state.currentPlayer === "X" ? "O" : "X",
    id: state.id,
    winner: null, // Undoing a move means game is no longer won
    moveHistory: state.moveHistory.slice(0, -1),
    takebackRequest: null,
  };
}

export function requestTakeback(state: GameState, requestingPlayer: Player): GameState {
  if (state.moveHistory.length === 0) {
    throw new Error("No moves to take back");
  }
  if (state.takebackRequest?.pending) {
    throw new Error("A takeback request is already pending");
  }

  return {
    ...state,
    takebackRequest: {
      requestedBy: requestingPlayer,
      pending: true,
    },
  };
}

export function respondToTakeback(state: GameState, approved: boolean): GameState {
  if (!state.takebackRequest?.pending) {
    throw new Error("No pending takeback request");
  }

  if (approved) {
    return undoLastMove(state);
  }

  return {
    ...state,
    takebackRequest: null,
  };
}
