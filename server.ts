import express from "express";
import expressWs from "express-ws";
import ViteExpress from "vite-express";
import { makeMove, createGame, requestTakeback, respondToTakeback } from "./src/tic-tac-toe";
import type { GameState, BoardSize, Player } from "./src/tic-tac-toe";
import type WebSocket from "ws";

export const { app } = expressWs(express());

app.use(express.json());

export let games = new Map<string, GameState>();

let socketGames = new Map<string, Set<WebSocket>>();

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

app.post("/api/newgame", (req, res) => {
  const { size } = req.body || {};
  const boardSize: BoardSize = [1, 2, 3, 4, 5, 6, 7].includes(size) ? size : 3;
  const newGameId = crypto.randomUUID();
  games.set(newGameId, createGame(newGameId, boardSize));
  res.json(games.get(newGameId));
});

app.get("/api/games", (_req, res) => {
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
  const { position } = req.body;

  if (typeof position !== "number") {
    return res.status(400).json({ error: "Position must be a number" });
  }

  const game = games.get(req.params.id);

  if (!game) {
    return res.status(404).json({ error: "Game not found" });
  }

  try {
    const updatedGame = makeMove(game, position);

    games.set(req.params.id, updatedGame);
    const recipients = socketGames.get(req.params.id);

    if (recipients) {
      recipients.forEach((recipient) => {
        if (recipient.readyState === 1) {
          recipient.send(JSON.stringify(updatedGame));
        }
      });
    }
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
  const existingGame = games.get(id);

  if (!existingGame) {
    return res.status(404).json({ error: "Game not found" });
  }

  const boardSize = existingGame.boardSize;
  const gameReset: GameState = {
    id,
    board: Array(boardSize * boardSize).fill(null),
    boardSize,
    currentPlayer: "X",
    winner: null,
    moveHistory: [],
    takebackRequest: null,
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

app.ws("/api/games/:id/ws", function (ws, req) {
  const gameId = req.params.id as string;

  if (!socketGames.has(gameId)) {
    socketGames.set(gameId, new Set());
  }

  const clients = socketGames.get(gameId)!;
  clients.add(ws);

  ws.send(
    JSON.stringify({
      type: "system",
      message: `Welcome! ${clients.size} user(s) online.`,
    }),
  );

  ws.on("message", function (msg) {
    const msgStr = msg.toString();
    console.log("ws message:", msgStr);

    try {
      const data = JSON.parse(msgStr);

      // Handle takeback request
      if (data.type === "takeback_request") {
        const game = games.get(gameId);
        if (!game) return;

        try {
          const updatedGame = requestTakeback(game, data.player as Player);
          games.set(gameId, updatedGame);

          // Broadcast to all clients including sender
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                type: "takeback_requested",
                game: updatedGame,
                requestedBy: data.player,
              }));
            }
          });
        } catch (err) {
          ws.send(JSON.stringify({
            type: "error",
            message: err instanceof Error ? err.message : "Failed to request takeback",
          }));
        }
        return;
      }

      // Handle takeback response
      if (data.type === "takeback_response") {
        const game = games.get(gameId);
        if (!game) return;

        try {
          const updatedGame = respondToTakeback(game, data.approved);
          games.set(gameId, updatedGame);

          // Broadcast to all clients
          clients.forEach((client) => {
            if (client.readyState === 1) {
              client.send(JSON.stringify({
                type: "takeback_resolved",
                game: updatedGame,
                approved: data.approved,
              }));
            }
          });
        } catch (err) {
          ws.send(JSON.stringify({
            type: "error",
            message: err instanceof Error ? err.message : "Failed to respond to takeback",
          }));
        }
        return;
      }

      // Default: broadcast to other clients (chat messages)
      clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(msgStr);
        }
      });
    } catch {
      // Not JSON, treat as chat message
      clients.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(msgStr);
        }
      });
    }
  });

  ws.on("close", () => {
    clients.delete(ws);
    if (clients.size === 0) {
      socketGames.delete(gameId);
    }
  });
});

const PORT = 5050;

if (process.env.NODE_ENV === "production") {
  ViteExpress.listen(app as any, PORT, () =>
    console.log(`Server is listening on ${PORT}...`),
  );
} else {
  app.listen(PORT, () =>
    console.log(`Server is listening on ${PORT}...`),
  );
}
