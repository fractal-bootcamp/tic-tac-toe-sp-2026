import express from "express";
import cors from "cors";
import { makeMove } from "./src/tic-tac-toe.ts";

const app = express();
app.use(cors());
app.use(express.json());
console.log(1234);
const gameState = {
  board: ["X", "O", null, null, null, null, null, null, null],
  currentPlayer: "X",
};

app.get("/api/game", (req, res) => {
  res.json(gameState);
});

app.get("/api/asdf", (req, res) => {
  res.json(gameState);
});

app.post("/api/move", (req, res) => {
  const { gs, index } = req.body;

  // your move logic here
  console.log("make amove");

  makeMove(gs, index);

  console.log(`Player  moved to ${index}`);
  res.json(gameState);
});

app.listen(3001, () => {
  console.log("rrr API server running on http://localhost:3001");
});
