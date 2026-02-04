// objectives:

// Add a /game (GET) and /move (POST) endpoints
// call makeMove in the server, manage the game state in-memory
// Use fetch() in App.tsx to read and write game data via a server
// Goal State:
// your game has identical functionality, but all game state is managed by the server
// game state persists if you refresh the tab, but not if you restart the server

// server.js
import express from "express";
import cors from "cors";

import { createGame, getWinner, makeMove } from "./src/tic-tac-toe.ts";
import type { GameState } from "./src/tic-tac-toe.ts";

let gameState: GameState = {
  board: ["X", "O", null, null, null, null, null, null, null],
  currentPlayer: "X",
};

console.log(gameState);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/game", (_req, res) => {
  res.json({
    board: ["X", "O", null, null, null, null, null, null, null],
    currentPlayer: "X",
  });
});

app.post("/api/move", (req, res) => {
  const { prev, index } = req.body;
  console.log(`Player ${prev} moved to ${index}`);
  res.json({ success: true, message: "Move received" });
});

app.listen(3001, () => {
  console.log("API server running on http://localhost:3001");
});
