export type Player = "X" | "O"; // States that the player will either have a value of X or 0

export type Cell = Player | null; // States that the player will either have a value of Player(variable) or null

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]; // explicitly defines that there must be nine values to the board (cells)

// GameState bundles together everything that you need to describe the game at any moment in time. Two key pieces of information, the board (which cells and by whom) and the player

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

// Function that defines the snapshot at the beginning of the game

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

// makeMove takes the current gamestate and a position and its job is to return a new game state reflecting that move

export function makeMove(state: GameState, position: number): GameState {
  return state
}

// takes a gamestate and checks whether someone has won

export function getWinner(state: GameState): Player | null {
  return null;
}
