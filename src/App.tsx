import { useState, useEffect } from "react";
import "./app.css";
import services from "./services/index";
import { type ShortLobbyReact } from "../types/types";

function App() {
  const [currentView, setCurrentView] = useState<string>("lobby");
  const [lobby, setLobby] = useState<ShortLobbyReact | null>(null);

  useEffect(() => {
    services.getLobby().then((r) => {
      console.log("response object", r);
      setLobby(r);
    });
  }, []);

  console.log("short lobby", lobby);

  const switchState = () => {
    if (currentView === "lobby") setCurrentView("game");
    else setCurrentView("lobby");
  };

  return (
    <div>
      {currentView === "lobby" ? <h1>Lobby</h1> : <h2> will be games later</h2>}
      <button onClick={() => switchState()}> change state</button>
    </div>
  );
}

export default App;
