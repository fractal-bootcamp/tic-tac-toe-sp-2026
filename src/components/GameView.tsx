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
  // open websocket

  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const onGameUpdateRef = useRef(onGameUpdate);
  onGameUpdateRef.current = onGameUpdate;

  const connect = () => {
    console.log("conenc");
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/api/games/${currentGame.id}/ws`;
    const ws = new WebSocket(wsUrl);
    // const ws = new WebSocket(wsUrl);
    console.log(ws);
    wsRef.current = ws;
    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        // console.log("move");
        // console.log(err)
        const data = JSON.parse(event.data);
        // console.log(data);

        if (
          data &&
          "board" in data &&
          "currentPlayer" in data &&
          "id" in data &&
          "winner" in data
        ) {
          // data is typed as GameState
          // console.log("datafrom move");
          // console.log(data);
          onGameUpdateRef.current(data);
        }
      } catch {
        // console.log("error");
      }
    };

    ws.onclose = () => {
      // setIsConnected(false)
      // setMessages(prev => [...prev, {
      //   type: 'system',
      //   text: 'Disconnected from server'
      // }])
      console.log("close");
    };

    ws.onerror = () => {
      // setMessages(prev => [...prev, {
      //   type: 'system',
      //   text: 'Connection error'
      // }])
      console.log("error");
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!currentGame) return <div>Loading game…</div>;

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
                      {" "}
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
      {/* <button onClick={() => onBackToLobby()}>back to lobby</button> */}

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
