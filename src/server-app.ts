import express from 'express';
import { createGame, makeMove } from './tic-tac-toe.js';
import type { GameState } from './tic-tac-toe.js';

export const app = express();
export const games = new Map<string, GameState>();

app.use(express.json());

// Create a new game
app.post('/api/games', (_req, res) => {
  const gameState = createGame();
  games.set(gameState.id, gameState);
  res.json(gameState);
});

// Get a specific game
app.get('/api/games/:id', (req, res) => {
  const gameId = req.params.id;
  const gameState = games.get(gameId);

  if (!gameState) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json(gameState);
});

// Make a move in a specific game
app.post('/api/games/:id/move', (req, res) => {
  try {
    const gameId = req.params.id;
    const { position } = req.body;

    const gameState = games.get(gameId);
    if (!gameState) {
      return res.status(404).json({ error: 'Game not found' });
    }

    if (typeof position !== 'number') {
      return res.status(400).json({ error: 'Position must be a number' });
    }

    if (gameState.winner !== null) {
      return res.status(400).json({ error: 'Game is already over' });
    }

    const updatedGameState = makeMove(gameState, position);
    games.set(gameId, updatedGameState);

    res.json(updatedGameState);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset a specific game
app.post('/api/games/:id/reset', (req, res) => {
  const gameId = req.params.id;

  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const newGameState = createGame();
  // Keep the same ID for reset
  newGameState.id = gameId;
  games.set(gameId, newGameState);

  res.json(newGameState);
});

// List all games
app.get('/api/games', (_req, res) => {
  const allGames = Array.from(games.values());
  res.json(allGames);
});

// Delete a specific game
app.delete('/api/games/:id', (req, res) => {
  const gameId = req.params.id;

  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }

  games.delete(gameId);
  res.status(204).send();
});