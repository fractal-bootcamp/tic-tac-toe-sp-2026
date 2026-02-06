import type { GameState, Cell } from "../tic-tac-toe";

import "../Cell.css";

type GameViewProps = {
  errorMessage: string | null;
  currentGame: GameState;
  makeMove: (gState: GameState, index: number) => Promise<void>;
  onBackToLobby: () => void;
};

export default function GameView({
  errorMessage,
  currentGame,
  makeMove,
  onBackToLobby,
}: GameViewProps) {
  // const [currentGame, setCurrentGame] = useState<GameState | null>(null);

  // useEffect(() => {
  //   setCurrentGame(games.find((g) => g.id === gameId) ?? null);
  // }, [games, gameId]);

  if (!currentGame) return <div>Loading game…</div>;

  return (
    <div>
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
      <button onClick={() => onBackToLobby()}>back to lobby</button>
    </div>
  );
}
