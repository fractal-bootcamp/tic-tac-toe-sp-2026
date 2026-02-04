import { useState } from "react";
import GameLobby from "./GameLobby";
import GameView from "./GameView";

type AppView = 'lobby' | 'game';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('lobby');
  const [selectedGameId, setSelectedGameId] = useState<string>('');

  const handleGameSelect = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentView('game');
  };

  const handleBackToLobby = () => {
    setCurrentView('lobby');
    setSelectedGameId('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {currentView === 'lobby' ? (
        <GameLobby onGameSelect={handleGameSelect} />
      ) : (
        <GameView
          gameId={selectedGameId}
          onBackToLobby={handleBackToLobby}
        />
      )}
    </div>
  );
}

export default App;