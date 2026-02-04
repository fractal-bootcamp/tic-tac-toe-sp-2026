//e.g server.js
import express from "express";
import ViteExpress from "vite-express";

import { makeMove } from "./src/tic-tac-toe";
import type { GameState } from "./src/tic-tac-toe";
const app = express();
app.use(express.json());

let game: GameState = {
  board: [null, null, null, null, null, null, null, null, null],
  currentPlayer: "X",
};

app.get("/api/game", (_req, res) => {
  res.json(game);
});

app.post("/api/move", (req, res) => {
  const { gState, index } = req.body;
  game = makeMove(gState, index);

  res.json(game);
});

app.post("/api/restart", (_req, res) => {
  game = {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };

  res.json(game);
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on 3000..."),
);
