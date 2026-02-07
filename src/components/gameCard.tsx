type card = {
  name: string;
  id: string;
  switchState: (id: string) => void;
};

const GameCard = ({ name, id, switchState }: card) => {
  return (
    <div className="card" onClick={() => switchState(id)}>
      <p>{name} </p>
    </div>
  );
};

export default GameCard;
