// Tests for new iteration of Tic Tac Toe with multiplayer server support

// when we call /newgame, we should get a back a new game uuid and initial game state

// when we call /move, we should expect a uuid as an input. if the uuid is invalid, we get an error back.

// if the uuid is valid, we get back the updated game state after the move is made.

// if we create a new game, we should expect the server to store a fresh game state with that uuid as the PK (key) of Map

// when we call /game/${gameID} for an existing game, we should get the game state back

// if we make a move on a particular game, we should expect the server to update the game state for that particular game only.

// on the frontend, we will have a "lobby" with a list of games

// when we call /listgames we should return a list of games (list length should be equal to db size)

// We will add a back button. If the back button is clicked, we should submit a request to the homepage.

// For the GameState, we should expect an optional field called "inActive" which is a boolean. If true, the game is inactive (deleted).

// When we call DELETE /game/${gameID}, we should mark that game as inactive in the server database (Map).

// When we call GET /listgames, we should not return inactive games.

import { describe, it, expect, beforeEach } from "vitest";
import { GAME_MAP, DEFAULT_GAME_STATE } from "./server/server";

beforeEach(() => {
  // Clear the database before each test for isolation
  GAME_MAP.clear();
});

// -----------------------------------------
// newGame()

// -----------------------------------------
describe("newGameCall", () => {
  it("fetchNewGame returns a new game state with a new uuid", async () => {
    const newgameState = await newGameCall();
    expect(newgameState.board).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
    expect(newgameState.currentPlayer).toBe("X");
    expect(newgameState.gameID).toBeDefined();
    expect(newgameState.gameID).toHaveLength(36); // UUID length
  });
});

describe("makeMove with multiplayer server", () => {
  it("makes a move on the server and returns updated game state", async () => {
    const mockUUID = "123e4567-e89b-12d3-a456-426614174000";

    const updatedState = await moveAPICall(
      mockUUID,
      0, // position
    );

    expect(updatedState.board[0]).toBe("X");
    expect(updatedState.currentPlayer).toBe("O");
    expect(updatedState.gameID).toBe(mockUUID);
  });
});

describe("toLobby makes a get request", () => {
  it("makes a get request to the homepage", async () => {
    const homepage = await toLobby();

    expect(homepage.status).toBe(200);
  });
});

describe("all active games are listed", () => {
  it("lists all active games", async () => {
    // add inactive game

    const inActiveGame: GameState = { ...DEFAULT_GAME_STATE, inActive: true };

    // add to mock db

    const activeGame: GameState = { ...DEFAULT_GAME_STATE };

    // add to mock db

    const activeGames: GameState[] = await getActiveGames();

    // function on mockDB for keys(), filtering where inActive: true

    // expect uuids from mockDB filter to be equal to the activeGames list
  });
});

describe("deleting a game removes it from the db", () => {
  it("deletes a gameID if inactive is true ", async () => {
    // use inactive game from previous test? generate new one?
    // add new inactive game to db
    // remove it with the function we defined
    // expect DB not to contain the inActive game
  });
});
