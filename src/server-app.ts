import express from 'express';
import expressWs from 'express-ws';
import { createGame, makeMove } from './tic-tac-toe.js';
import type { GameState } from './tic-tac-toe.js';
import type { Application } from 'express-ws';
import type { WebSocket } from 'ws';

const { app: expressApp } = expressWs(express());
export const app = expressApp as Application;
export const games = new Map<string, GameState>();

// Store WebSocket connections per game
const gameConnections = new Map<string, Set<WebSocket>>();

// Helper function to broadcast game updates to all connected clients
function broadcastGameUpdate(gameId: string, gameState: GameState) {
  const connections = gameConnections.get(gameId);
  if (connections) {
    connections.forEach(ws => {
      if (ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({
          type: 'gameUpdate',
          gameState
        }));
      }
    });
  }
}

app.use(express.json());

// WebSocket endpoint for game subscriptions
app.ws('/api/games/:id/ws', (ws, req) => {
  const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  // Check if game exists
  if (!games.has(gameId)) {
    ws.close(1008, 'Game not found');
    return;
  }

  // Add connection to the game's connection set
  if (!gameConnections.has(gameId)) {
    gameConnections.set(gameId, new Set());
  }
  gameConnections.get(gameId)!.add(ws);

  // Send current game state immediately upon connection
  const gameState = games.get(gameId);
  if (gameState) {
    ws.send(JSON.stringify({
      type: 'gameUpdate',
      gameState
    }));
  }

  // Handle client disconnect
  ws.on('close', () => {
    const connections = gameConnections.get(gameId);
    if (connections) {
      connections.delete(ws);
      // Clean up empty connection sets
      if (connections.size === 0) {
        gameConnections.delete(gameId);
      }
    }
  });

  // Handle client errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Create a new game
app.post('/api/games', (_req, res) => {
  const gameState = createGame();
  games.set(gameState.id, gameState);
  res.json(gameState);
});

// Get a specific game
app.get('/api/games/:id', (req, res) => {
  const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const gameState = games.get(gameId);

  if (!gameState) {
    return res.status(404).json({ error: 'Game not found' });
  }

  res.json(gameState);
});

// Make a move in a specific game
app.post('/api/games/:id/move', (req, res) => {
  try {
    const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
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

    // Broadcast the update to all connected clients
    broadcastGameUpdate(gameId, updatedGameState);

    res.json(updatedGameState);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Reset a specific game
app.post('/api/games/:id/reset', (req, res) => {
  const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }

  const newGameState = createGame();
  // Keep the same ID for reset
  newGameState.id = gameId;
  games.set(gameId, newGameState);

  // Broadcast the update to all connected clients
  broadcastGameUpdate(gameId, newGameState);

  res.json(newGameState);
});

// List all games
app.get('/api/games', (_req, res) => {
  const allGames = Array.from(games.values());
  res.json(allGames);
});

// Delete a specific game
app.delete('/api/games/:id', (req, res) => {
  const gameId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!games.has(gameId)) {
    return res.status(404).json({ error: 'Game not found' });
  }

  games.delete(gameId);
  res.status(204).send();
});