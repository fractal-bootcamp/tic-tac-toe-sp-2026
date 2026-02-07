type GameBoardViewProps = {
  gameBoard: (string | null)[];
  boardSize: number;
};

export default function GameBoardView({ gameBoard, boardSize }: GameBoardViewProps) {
  return (
    <div className="gameBoard" style={{ width: `${boardSize * 16}px`, height: `${boardSize * 16}px` }}>
      {gameBoard.map((cell, index) => (
        <span key={index}>
          {cell === null ? `_` : cell}
          {(index + 1) % boardSize === 0 && index < gameBoard.length - 1 && <br />}
        </span>
      ))}
    </div>
  );
}
