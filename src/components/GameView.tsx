import type { GameState, Cell, Player } from "../tic-tac-toe";
import { useEffect, useState, useRef } from "react";
import "../Cell.css";

type GameViewProps = {
  errorMessage: string | null;
  currentGame: GameState;
  makeMove: (gState: GameState, index: number) => Promise<void>;
  onBackToLobby: () => void;
  onGameUpdate: (gState: GameState) => void;
};

export default function GameView({
  errorMessage,
  currentGame,
  makeMove,
  onBackToLobby,
  onGameUpdate,
}: GameViewProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [playingAs, setPlayingAs] = useState<Player | null>(null);
  const [takebackMessage, setTakebackMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const onGameUpdateRef = useRef(onGameUpdate);
  onGameUpdateRef.current = onGameUpdate;

  const requestTakeback = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && playingAs) {
      wsRef.current.send(JSON.stringify({
        type: "takeback_request",
        player: playingAs,
      }));
    }
  };

  const respondToTakeback = (approved: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "takeback_response",
        approved,
      }));
    }
  };

  const connect = () => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/games/${currentGame.id}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle game state updates (from moves)
        if (
          data &&
          "board" in data &&
          "currentPlayer" in data &&
          "id" in data &&
          "winner" in data
        ) {
          onGameUpdateRef.current(data);
        }

        // Handle takeback request notification
        if (data.type === "takeback_requested" && data.game) {
          onGameUpdateRef.current(data.game);
          setTakebackMessage(`${data.requestedBy} requested a takeback`);
        }

        // Handle takeback resolution
        if (data.type === "takeback_resolved" && data.game) {
          onGameUpdateRef.current(data.game);
          setTakebackMessage(data.approved ? "Takeback approved!" : "Takeback denied");
          setTimeout(() => setTakebackMessage(null), 2000);
        }

        // Handle errors
        if (data.type === "error") {
          setTakebackMessage(data.message);
          setTimeout(() => setTakebackMessage(null), 3000);
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    ws.onclose = () => {};

    ws.onerror = () => {};
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!currentGame) return <div>Loading game...</div>;

  const size = currentGame.boardSize;
  const rows = Array.from({ length: size }, (_, i) => i);
  const hasMoves = currentGame.moveHistory && currentGame.moveHistory.length > 0;
  const hasPendingTakeback = currentGame.takebackRequest?.pending;
  const canRequestTakeback = playingAs && hasMoves && !hasPendingTakeback && !currentGame.winner;
  const canRespondToTakeback = hasPendingTakeback && playingAs && currentGame.takebackRequest?.requestedBy !== playingAs;

  const isMyTurn = playingAs && currentGame.currentPlayer === playingAs;
  const isGameOver = currentGame.winner !== null;
  const canMakeMove = isMyTurn && !isGameOver;

  return (
    <div>
      {isConnected}

      {/* Player selection */}
      {!playingAs && (
        <div style={{
          padding: "10px",
          margin: "10px 0",
          backgroundColor: "#e2e3e5",
          border: "1px solid #d6d8db",
          borderRadius: "4px"
        }}>
          <div>Select your side to start playing:</div>
          <button onClick={() => setPlayingAs("X")} style={{ margin: "5px" }}>Play as X</button>
          <button onClick={() => setPlayingAs("O")} style={{ margin: "5px" }}>Play as O</button>
        </div>
      )}
      {playingAs && (
        <div style={{ marginBottom: "10px" }}>
          Playing as: <strong>{playingAs}</strong>
          <button onClick={() => setPlayingAs(null)} style={{ marginLeft: "10px" }}>change</button>
        </div>
      )}

      {/* Turn indicator */}
      {playingAs && !isGameOver && (
        <div style={{
          padding: "10px",
          margin: "10px 0",
          backgroundColor: isMyTurn ? "#d4edda" : "#fff3cd",
          border: `1px solid ${isMyTurn ? "#c3e6cb" : "#ffeeba"}`,
          borderRadius: "4px"
        }}>
          {isMyTurn
            ? "Your turn! Click a cell to play."
            : `Waiting for ${currentGame.currentPlayer} to move...`}
        </div>
      )}

      <table
        className="board"
        style={{
          width: `${size * 80}px`,
          opacity: (playingAs && !isMyTurn && !isGameOver) ? 0.6 : 1,
          pointerEvents: canMakeMove ? "auto" : "none"
        }}
      >
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              {currentGame.board
                .slice(row * size, row * size + size)
                .map((cell: Cell, colIndex: number) => {
                  const index = row * size + colIndex;
                  return (
                    <td
                      key={index}
                      className={cell ? "filled" : ""}
                      onClick={() => makeMove(currentGame, index)}
                    >
                      {cell ?? ""}
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {isGameOver
          ? `Game over! Winner: ${currentGame.winner}`
          : `Current player: ${currentGame.currentPlayer}`}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {takebackMessage && <div style={{ color: "#666", margin: "10px 0" }}>{takebackMessage}</div>}

      {/* Takeback UI */}
      <div style={{ margin: "10px 0" }}>
        {canRequestTakeback && (
          <button onClick={requestTakeback}>Request Takeback</button>
        )}
        {canRespondToTakeback && (
          <div>
            <span>{currentGame.takebackRequest?.requestedBy} wants a takeback: </span>
            <button onClick={() => respondToTakeback(true)}>Approve</button>
            <button onClick={() => respondToTakeback(false)}>Deny</button>
          </div>
        )}
        {hasPendingTakeback && currentGame.takebackRequest?.requestedBy === playingAs && (
          <div style={{ color: "#666" }}>Waiting for opponent to respond...</div>
        )}
      </div>

      <br />
      <button
        onClick={() => {
          wsRef.current?.close();
          onBackToLobby();
        }}
      >
        back to lobby
      </button>
    </div>
  );
}
