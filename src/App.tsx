import { useState, useEffect } from "react";
import { getWinner } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";
import "./Cell.css";

import GameView from "./components/GameView";
import GameList from "./components/GameList";

function App() {
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameList, setGameList] = useState<GameState[]>([]);
  const [currentGameId, setCurrentGameId] = useState("");
  const [view, setView] = useState("lobby");

  const getGameList = async () => {
    const response = await fetch("/api/games");
    const data = await response.json();
    setGameList(data);
  };

  const makeMove = async (gState: GameState, position: number) => {
    try {
      const response = await fetch(`/api/games/${gState.id}/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ position }),
      });

      const data = await response.json();
      setCurrentGame(data);
    } catch (error) {
      console.error("Failed to make move:", error);
    }
  };

  const newGame = async () => {
    try {
      const response = await fetch(`/api/newgame`, {
        method: "POST",
      });

      const data = await response.json();

      if (data) getGameList();
    } catch (error) {
      console.error("failed to start game", error);
    }
  };

  const deleteGame = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete game");
      }

      getGameList();
    } catch (error) {
      console.error("failed to start game", error);
    }
  };

  const resetGame = async (id: string) => {
    try {
      const response = await fetch(`/api/games/${id}/reset`, {
        method: "POST",
      });

      const data = await response.json();
      if (data) getGameList();
    } catch (error) {
      console.error("failed to start game", error);
    }
  };

  const handleGameSelect = (id: string) => {
    setCurrentGameId(id);
    // setSelectedGameId(id);

    setCurrentGame(gameList.find((g) => g.id === id) ?? null);

    setView("game");
  };
  const handleBackToLobby = () => {
    setView("lobby");

    setCurrentGameId("");
    getGameList();
    setCurrentGame(null);
  };

  const onGameUpdate = (gState: GameState) => {
    setCurrentGame(gState);
  };

  useEffect(() => {
    if (!currentGame) return;

    const winner = getWinner(currentGame);

    if (!winner && !currentGame.board.includes(null)) {
      setErrorMessage("draw!");
      return;
    }

    if (winner) {
      setErrorMessage(`${winner} wins!`);
      return;
    }
  }, [currentGame]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Match your animation duration

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // useEffect(() => {

  // }, [currentGame]);

  useEffect(() => {
    setCurrentGame(gameList.find((g) => g.id === currentGameId) ?? null);
  }, [currentGameId]);

  useEffect(() => {
    getGameList();
  }, []);

  // TODO: display the currentGame, and call `makeMove` when a player clicks a button
  return (
    <div>
      <div>Noughts & Crosses</div>
      <div></div>

      {view === "lobby" ? (
        <GameList
          games={gameList}
          newGame={newGame}
          deleteGame={deleteGame}
          resetGame={resetGame}
          onGameSelect={handleGameSelect}
        />
      ) : null}

      {currentGame ? (
        <GameView
          currentGame={currentGame}
          makeMove={makeMove}
          onGameUpdate={onGameUpdate}
          errorMessage={errorMessage}
          onBackToLobby={handleBackToLobby}
        />
      ) : null}
    </div>
  );
}

// function getInitialGame() {
//   let initialGameState = createGame();
//   // initialGameState = makeMove(initialGameState, 3);
//   // initialGameState = makeMove(initialGameState, 0);
//   return initialGameState;
// }

export default App;
