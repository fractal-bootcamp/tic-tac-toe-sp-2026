type GameBoardViewProps = {
  gameBoard: (string | null)[];
};

export default function GameBoardView({ gameBoard }: GameBoardViewProps) {
  // const [currentGame, setCurrentGame] = useState<GameState | null>(null);

  // useEffect(() => {
  //   setCurrentGame(games.find((g) => g.id === gameId) ?? null);
  // }, [games, gameId]);

  return (
    <div className="gameBoard">
      {gameBoard.map((cell, index) => (
        <span key={index}>
          {cell === null ? ` _ ` : ` ${cell} `}
          {(index === 2 || index === 5) && <br />}
        </span>
      ))}
    </div>
  );
}
