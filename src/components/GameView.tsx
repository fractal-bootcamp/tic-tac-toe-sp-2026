import type { GameState, Cell } from "../tic-tac-toe";
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
  const wsRef = useRef<WebSocket | null>(null);

  const onGameUpdateRef = useRef(onGameUpdate);
  onGameUpdateRef.current = onGameUpdate;

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

        if (
          data &&
          "board" in data &&
          "currentPlayer" in data &&
          "id" in data &&
          "winner" in data
        ) {
          onGameUpdateRef.current(data);
        }
      } catch {
        throw Error;
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

  return (
    <div>
      {isConnected}
      <table className="board">
        <tbody>
          {[0, 1, 2].map((row) => (
            <tr key={row}>
              {currentGame.board
                .slice(row * 3, row * 3 + 3)
                .map((cell: Cell, colIndex: number) => {
                  const index = row * 3 + colIndex;
                  return (
                    <td
                      key={index}
                      className={cell ? "filled" : ""}
                      onClick={
                        currentGame.winner === null
                          ? () => makeMove(currentGame, index)
                          : undefined
                      }
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
        {currentGame.winner === null
          ? `current player: ${currentGame.currentPlayer}`
          : `game over! winner is: ${currentGame.winner}`}
      </div>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
