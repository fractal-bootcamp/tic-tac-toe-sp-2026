# Ultimate Tic-Tac-Toe

A real-time multiplayer Ultimate Tic-Tac-Toe game built with React, TypeScript, and Express with WebSocket support.

## What is Ultimate Tic-Tac-Toe?

Ultimate Tic-Tac-Toe is a more strategic version of the classic game. The board consists of nine smaller tic-tac-toe boards arranged in a 3x3 grid. Each move you make determines which sub-board your opponent must play in next. Win three sub-boards in a row to win the game.

### Rules

1. Player X goes first and may play in any cell on any sub-board.
2. The cell you pick determines which sub-board your opponent must play in next (e.g., playing in the top-right cell sends your opponent to the top-right sub-board).
3. If your opponent is sent to a sub-board that's already been won, they may play in any open sub-board.
4. Win a sub-board by getting three in a row within it.
5. Win the game by winning three sub-boards in a row (horizontally, vertically, or diagonally).

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Express 5, WebSockets (express-ws), Bun runtime
- **Testing:** Vitest, Supertest

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

This starts the Express server with Vite middleware on `localhost:3000`.

### Production Build

```bash
bun run build
bun run start
```

### Testing

```bash
bun run test
```

## How to Play

1. Open the app and enter a nickname.
2. Create a new room or join an existing one with a room code.
3. Choose to play as X or O.
4. Once both players are ready, start the game.
5. Take turns placing your mark — the cell you choose dictates where your opponent plays next.
6. After a game ends, you can start a new game in the same room. Previous games are shown as thumbnails.

## Project Structure

```
src/
├── components/        # React UI components
│   ├── Lobby.tsx      # Room creation and joining
│   ├── Room.tsx       # Game room and player assignment
│   ├── UltimateTicTacToe.tsx
│   ├── MainBoard.tsx  # 3x3 grid of sub-boards
│   ├── SubBoard.tsx   # Individual tic-tac-toe board
│   └── GameThumbnail.tsx
├── types/             # TypeScript type definitions
├── utils/             # Styling and date helpers
├── App.tsx            # Root component with WebSocket setup
├── server.ts          # Express + WebSocket backend
└── ultimate-tic-tac-toe.ts  # Core game logic
```
