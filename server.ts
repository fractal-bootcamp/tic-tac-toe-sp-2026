import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, makeMove, getWinner, GameState } from './src/tic-tac-toe.js';

const app = express();
const PORT = 3000;

app.use(express.json());

let gameState: GameState = createGame();

app.get('/api/game', (req, res) => {
  res.json(gameState);
});

app.post('/api/move', (req, res) => {
  try {
    const { position } = req.body;

    if (typeof position !== 'number') {
      return res.status(400).json({ error: 'Position must be a number' });
    }

    if (gameState.winner !== null) {
      return res.status(400).json({ error: 'Game is already over' });
    }

    gameState = makeMove(gameState, position);

    res.json(gameState);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.post('/api/game/reset', (req, res) => {
  gameState = createGame();
  res.json(gameState);
});

ViteExpress.listen(app, PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});