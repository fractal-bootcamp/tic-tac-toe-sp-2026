import express from "express";
import viteExpress from "vite-express";
import { makeMove, createGame } from "./src/tic-tac-toe.ts";

const app = express();

app.use(express.json());

let gameState = createGame();

console.log(gameState);

app.post("/api/move", (req, res) => {
  const { index } = req.body;
  console.log(gameState);
  gameState = makeMove(gameState, index);
  console.log(gameState);
  res.json(gameState);
});

app.get("/api/getGameState", (req, res) => {
  res.json(gameState);
});

app.post("/api/createNewGame", (req, res) => {
  gameState = createGame();
  console.log(gameState);
  res.json(gameState);
});

const PORT = 3005;

viteExpress.listen(app, PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
