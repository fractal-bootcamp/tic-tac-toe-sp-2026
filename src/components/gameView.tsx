import { type ShortLobbyReact } from "../../types/types";
import GameCard from "./gameCard";

type gameView = {
  lobby: ShortLobbyReact;
  switchState: (id: string) => void;
};

//map over the object to show card
const GameView = ({ lobby, switchState }: gameView) => {
  const lobbyKeys = Object.keys(lobby);

  return (
    <div>
      {lobbyKeys.map((el: string) => {
        const value = lobby[el];
        return (
          <GameCard key={el} name={value} id={el} switchState={switchState} />
        );
      })}
    </div>
  );
};

export default GameView;
