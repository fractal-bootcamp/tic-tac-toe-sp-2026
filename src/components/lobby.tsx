import type { ShortLobbyReact } from "../../types/types";

import GameView from "./gameView";

type LobbyComponent = {
  lobby: ShortLobbyReact;
  switchState: (id: string) => void;
};

//types for lobby

const Lobby = ({ lobby, switchState }: LobbyComponent) => {
  return (
    <div>
      {lobby === null ? (
        <p> loading </p>
      ) : (
        <div>
          <h2>lobby</h2>
          <GameView lobby={lobby} switchState={switchState} />
        </div>
      )}
    </div>
  );
};

export default Lobby;
