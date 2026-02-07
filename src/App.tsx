import { useState, useEffect } from "react";
import "./app.css";
import services from "./services/index";
import { type ShortLobbyReact } from "../types/types";
import Lobby from "./components/lobby";
import Game from "./components/game";

function App() {
  const [currentView, setCurrentView] = useState<string>("lobby");
  const [lobby, setLobby] = useState<ShortLobbyReact | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    services.getLobby().then((r) => {
      console.log("response object", r);
      setLobby(r);
    });
  }, []);

  console.log("short lobby", lobby);

  const switchState = (id: string) => {
    if (currentView === "lobby") setCurrentView("game");
    else setCurrentView("lobby");
    setGameId(id);
  };
  return (
    <div>
      <h1>tic tac toe</h1>
      {currentView === "lobby" ? (
        <Lobby lobby={lobby!} switchState={switchState} />
      ) : (
        <Game id={gameId!} />
      )}
    </div>
  );
}
export default App;
