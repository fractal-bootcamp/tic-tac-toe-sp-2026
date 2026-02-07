import { useState, useEffect, useRef, useCallback } from "react";
import { type GameState, getWinner } from "./tic-tac-toe";

function PixelIcon({ src, alt, size = "w-[80px] h-[80px] md:w-[110px] md:h-[110px]" }: { src: string; alt: string; size?: string }) {
  return <img src={src} alt={alt} className={`${size} inline-block object-contain`} style={{ imageRendering: "pixelated" }} />;
}

function symbolFor(cell: string | null, size?: string): React.ReactNode {
  if (cell === "X") return <PixelIcon src="/flower.png" alt="Flower" size={size} />;
  if (cell === "O") return <PixelIcon src="/snail.png" alt="Snail" size={size} />;
  return null;
}

type PlayerRole = "X" | "O" | "spectator" | null;

function App() {
  const [playerName, setPlayerName] = useState<string>(() => localStorage.getItem("playerName") || "");
  const [signedIn, setSignedIn] = useState<boolean>(() => !!localStorage.getItem("playerName"));
  const [nameInput, setNameInput] = useState("");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameList, setGameList] = useState<GameState[]>([]);
  const [role, setRole] = useState<PlayerRole>(null);
  const hasConnected = useRef(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (signedIn && gameState === null) {
      fetch("/games")
        .then((res) => res.json())
        .then((data) => setGameList(data));
    }
  }, [signedIn, gameState]);

  const connectWebSocket = useCallback(() => {
    if (gameState === null) return;
    if (hasConnected.current) return;

    hasConnected.current = true;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(
      `${protocol}//${window.location.host}/game/${gameState.id}/ws`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Client joined game:", gameState.id);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    ws.onmessage = (event) => {
      const updateGame = JSON.parse(event.data);
      setGameState(updateGame);
    };
  }, [gameState?.id]);

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      hasConnected.current = false;
    };
  }, [connectWebSocket]);

  const handleSignIn = () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    localStorage.setItem("playerName", trimmed);
    setPlayerName(trimmed);
    setSignedIn(true);
  };

  // Sign-in screen
  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-pixel text-main-teal text-xs md:text-base px-4">
        <h1 className="text-lg md:text-3xl font-bold mb-6 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center">
          <PixelIcon src="/flower.png" alt="Flower" size="w-20 h-20 md:w-24 md:h-24" />
          Garden vs Snails
          <PixelIcon src="/snail.png" alt="Snail" size="w-20 h-20 md:w-24 md:h-24" />
        </h1>
        <p className="mb-4 text-xs md:text-sm">Enter your name to play:</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignIn();
          }}
          className="flex flex-col items-center gap-3"
        >
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            className="px-4 py-2 border border-board-border rounded-lg text-main-teal text-xs md:text-sm bg-white/50 outline-none focus:border-main-teal text-center"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 md:px-8 md:py-4 bg-main-teal text-white rounded-lg hover:bg-main-teal/80 transition-colors cursor-pointer text-xs md:text-sm font-bold"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // Lobby
  if (gameState === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen font-pixel text-main-teal text-xs md:text-base px-4">
        <h1 className="text-lg md:text-3xl font-bold mb-4 flex flex-col md:flex-row items-center gap-2 md:gap-3 text-center">
          <PixelIcon src="/flower.png" alt="Flower" size="w-20 h-20 md:w-24 md:h-24" />
          Garden vs Snails
          <PixelIcon src="/snail.png" alt="Snail" size="w-20 h-20 md:w-24 md:h-24" />
        </h1>
        <p className="mb-4 text-xs md:text-sm">
          Playing as: <span className="font-bold">{playerName}</span>
        </p>
        {gameList.length > 0 && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <h2 className="text-xs md:text-sm">Join a game:</h2>
            {gameList
              .filter(
                (game) =>
                  !getWinner(game) &&
                  !game.board.every((cell) => cell !== null)
              )
              .map((game) => (
                <button
                  key={game.id}
                  className="m-1 px-4 py-2 bg-board-border/30 border border-board-border rounded-lg hover:bg-board-border/50 transition-colors cursor-pointer text-main-teal text-[8px] md:text-xs"
                  onClick={() => {
                    fetch("/join", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ gameId: game.id, playerName }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        setRole(data.role);
                        setGameState(data.gameState);
                      });
                  }}
                >
                  {game.id}
                  {game.players && (
                    <span className="ml-2 text-[7px] md:text-[10px] opacity-70">
                      ({game.players.X || "???"} vs {game.players.O || "???"})
                    </span>
                  )}
                </button>
              ))}
          </div>
        )}
        <button
          className="m-1 mt-6 px-6 py-3 md:px-8 md:py-4 bg-main-teal text-white rounded-lg hover:bg-main-teal/80 transition-colors cursor-pointer text-xs md:text-sm font-bold"
          onClick={() => {
            fetch("/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ playerName }),
            })
              .then((res) => res.json())
              .then((data) => {
                setRole("X");
                setGameState(data);
              });
          }}
        >
          New Game
        </button>
      </div>
    );
  }

  const winner = getWinner(gameState);
  const isTie =
    !winner && gameState.board.every((cell) => cell !== null);
  const isGameOver = !!winner || isTie;

  const flowerPlayer = gameState.players?.X;
  const snailPlayer = gameState.players?.O;

  const isMyTurn = role === gameState.currentPlayer;
  const canClick = !isGameOver && role !== "spectator" && isMyTurn;

  const currentTurnName = gameState.players?.[gameState.currentPlayer] || (gameState.currentPlayer === "X" ? "Garden" : "Snails");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-pixel text-main-teal text-sm md:text-base px-4">
      {/* PLAYER NAMES */}
      <div className="flex items-center gap-4 mb-2 text-[8px] md:text-xs">
        <span className="flex items-center gap-1 text-garden-pink">
          <PixelIcon src="/flower.png" alt="Flower" size="w-8 h-8 md:w-10 md:h-10" />
          {flowerPlayer || "Waiting..."}
        </span>
        <span className="text-main-teal">vs</span>
        <span className="flex items-center gap-1 text-olive">
          <PixelIcon src="/snail.png" alt="Snail" size="w-8 h-8 md:w-10 md:h-10" />
          {snailPlayer || "Waiting..."}
        </span>
      </div>

      {/* ROLE INDICATOR */}
      {role === "spectator" && (
        <p className="text-main-teal/60 text-[8px] md:text-xs mb-2">You are spectating</p>
      )}

      {/* STATUS MESSAGE */}
      {!isGameOver && (
        <p
          className={
            gameState.currentPlayer === "X"
              ? "text-garden-pink"
              : "text-olive"
          }
        >
          <span className="flex items-center gap-2">
            Current turn: {symbolFor(gameState.currentPlayer, "w-12 h-12 md:w-14 md:h-14")}{" "}
            {currentTurnName}
          </span>
        </p>
      )}
      {winner === "X" && (
        <p className="text-garden-pink text-xs md:text-sm font-bold animate-winner-bounce flex items-center gap-2 text-center">
          Yay! The garden is flourishing! <PixelIcon src="/flower.png" alt="Flower" size="w-12 h-12 md:w-14 md:h-14" />
        </p>
      )}
      {winner === "O" && (
        <p className="text-olive text-xs md:text-sm font-bold animate-winner-bounce flex items-center gap-2 text-center">
          Oh no! The snails took over the garden! <PixelIcon src="/snail.png" alt="Snail" size="w-12 h-12 md:w-14 md:h-14" />
        </p>
      )}
      {isTie && (
        <p className="text-main-teal text-xs md:text-sm text-center">
          The snails and flowers share the garden... it's a tie!
        </p>
      )}

      {/* GAME BOARD */}
      <table className="border border-board-border border-collapse mt-4">
        <tbody>
          {[0, 3, 6].map((rowStart) => (
            <tr key={rowStart}>
              {[0, 1, 2].map((col) => {
                const position = rowStart + col;
                const cellValue = gameState.board[position];

                return (
                  <td
                    key={position}
                    className={`border border-board-border w-[85px] h-[85px] md:w-[120px] md:h-[120px] text-center transition-colors ${
                      canClick && cellValue === null
                        ? "cursor-pointer hover:bg-board-border/10"
                        : "cursor-default"
                    }`}
                    onClick={() => {
                      if (
                        canClick &&
                        gameState.board[position] === null
                      ) {
                        fetch("/move", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            gameId: gameState.id,
                            position,
                            playerName,
                          }),
                        })
                          .then((res) => {
                            if (!res.ok) return null;
                            return res.json();
                          })
                          .then((data) => {
                            if (data) setGameState(data);
                          });
                      }
                    }}
                  >
                    {winner ? (
                      <span
                        className="animate-winner-pop inline-block"
                        style={{
                          animationDelay: `${position * 0.12}s`,
                          opacity: 0,
                        }}
                      >
                        {symbolFor(winner)}
                      </span>
                    ) : (
                      symbolFor(cellValue)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="mt-6 md:mt-10 px-6 py-3 md:px-10 md:py-5 bg-board-border rounded-lg hover:bg-board-border/70 transition-colors cursor-pointer text-main-teal text-[8px] md:text-xs font-bold"
        onClick={() => {
          setGameState(null);
          setRole(null);
        }}
      >
        Head Back to Lobby
      </button>
    </div>
  );
}

export default App;
