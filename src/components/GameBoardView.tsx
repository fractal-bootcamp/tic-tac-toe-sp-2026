type GameBoardViewProps = {
  gameBoard: (string | null)[];
};

export default function GameBoardView({ gameBoard }: GameBoardViewProps) {
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
