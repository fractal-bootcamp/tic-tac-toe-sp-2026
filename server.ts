//e.g server.js
import express from "express";
import ViteExpress from "vite-express";

import { makeMove, createGame } from "./src/tic-tac-toe";
import type { GameState } from "./src/tic-tac-toe";
export const app = express();
app.use(express.json());

// let game: GameState = {
//   board: [null, null, null, null, null, null, null, null, null],
//   currentPlayer: "X",
//   id: crypto.randomUUID(),
//   winner: null,
// };

export let games = new Map<string, GameState>();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// get api/list
// newGame
// /game - add which game
// /move - add whcih game

// newGaem

app.post("/api/newgame", (_req, res) => {
  const newGameId = crypto.randomUUID();
  games.set(newGameId, createGame(newGameId));
  res.json(games.get(newGameId));
});

// get api/list
app.get("/api/games", (_req, res) => {
  // res.json(Array.from(games.entries())); // [ [id, gameState], ... ]

  res.json([...games.values()]);
});

app.get("/api/games/:id", (req, res) => {
  const { id } = req.params;

  if (!UUID_REGEX.test(id)) {
    return res.status(400).json({ error: "Invalid game id" });
  }

  const game = games.get(id);
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.json(game);
});

app.post("/api/games/:id/move", (req, res) => {
  console.log("making move!");
  const { position } = req.body;

  console.log(position);

  // validate index
  if (typeof position !== "number") {
    return res.status(400).json({ error: "Position must be a number" });
  }

  const game = games.get(req.params.id);

  // guard against undefined
  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  try {
    const updatedGame = makeMove(game, position);

    games.set(req.params.id, updatedGame);

    return res.json(updatedGame);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/games/:id/reset", (req, res) => {
  const { id } = req.params;

  // 1) must exist to "reset"
  if (!games.has(id)) {
    return res.status(404).json({ error: "Game not found" });
  }

  const gameReset: GameState = {
    id,
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
    winner: null,
  };

  games.set(id, gameReset);

  res.json(gameReset);
});

app.delete("/api/games/:id", (req, res) => {
  const { id } = req.params;

  const deleted = games.delete(id);

  if (!deleted) {
    return res.status(404).json({ error: "Game not found" });
  }

  res.sendStatus(204);
});

// describe.only("DELETE /api/games/:id", () => {
//   it("should delete an existing game", async () => {
//     const createResponse = await request(app)
//       .post("/api/newgame")
//       .expect(200);

//     const gameId = createResponse.body.id;

const PORT = 5050;

ViteExpress.listen(app, PORT, () =>
  console.log(`Server is listening on ${PORT}...`),
);
