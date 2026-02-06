import { useState, useEffect } from "react";
import { createGame, getWinner } from "./tic-tac-toe";
import type { GameState } from "./tic-tac-toe";
import "./Cell.css";

import GameView from "./components/GameView";
import GameList from "./components/GameList";

function App() {
  const [gameState, setGameState] = useState(getInitialGame());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [gameList, setGameList] = useState<GameState[]>([]);

  const [currentGame, setCurrentGame] = useState<GameState | null>(null);

  const [currentGameId, setCurrentGameId] = useState("");

  const [view, setView] = useState("lobby");
  // const [selectedGameId, setSelectedGameId] = useState("");

  // const restartGame = async () => {
  //   try {
  //     const response = await fetch("/api/restart", {
  //       method: "POST",
  //     });
  //     const data = await response.json();
  //     setGameState(data);
  //   } catch (error) {
  //     console.error("Failed to make move:", error);
  //   }
  // };

  // const getGame = async (id: string) => {
  //   try {
  //     const response = await fetch(`/api/games/${id}`);

  //     const data = await response.json();
  //     setGameState(data);
  //   } catch (error) {
  //     console.error("Failed to make move:", error);
  //   }
  // };

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
      // console.log(data);
      setGameState(data);
    } catch (error) {
      console.error("Failed to make move:", error);
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

  useEffect(() => {
    setCurrentGame(gameState);

    const winner = getWinner(gameState);

    // no winner, draw
    if (!winner && !gameState.board.includes(null)) {
      setErrorMessage("draw!");
      // restartGame();
      return;
    }

    // no winner
    if (!winner) return;

    // winner
    if (winner) {
      setErrorMessage(`${winner} wins!`);
      // restartGame();
      return;
    }
  }, [gameState]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Match your animation duration

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // useEffect(() => {

  // }, [gameState]);

  useEffect(() => {
    setCurrentGame(gameList.find((g) => g.id === currentGameId) ?? null);
  }, [currentGameId]);

  useEffect(() => {
    getGameList();
  }, []);

  // TODO: display the gameState, and call `makeMove` when a player clicks a button
  return (
    <div>
      <div>Noughts & Crosses</div>
      <div></div>
      {view === "lobby" ? (
        <GameList games={gameList} onGameSelect={handleGameSelect} />
      ) : null}

      {currentGame ? (
        <GameView
          currentGame={currentGame}
          makeMove={makeMove}
          errorMessage={errorMessage}
          onBackToLobby={handleBackToLobby}
        />
      ) : null}
    </div>
  );
}

function getInitialGame() {
  let initialGameState = createGame();
  // initialGameState = makeMove(initialGameState, 3);
  // initialGameState = makeMove(initialGameState, 0);
  return initialGameState;
}

export default App;
