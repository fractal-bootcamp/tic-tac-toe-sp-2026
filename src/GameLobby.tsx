import { useState, useEffect } from "react";
import type { GameState } from "./tic-tac-toe";

interface GameLobbyProps {
  onGameSelect: (gameId: string) => void;
}

function GameLobby({ onGameSelect }: GameLobbyProps) {
  const [games, setGames] = useState<GameState[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      const data: GameState[] = await response.json();
      setGames(data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const createNewGame = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
      });

      if (response.ok) {
        const newGame: GameState = await response.json();
        onGameSelect(newGame.id);
      } else {
        console.error('Failed to create game');
      }
    } catch (error) {
      console.error('Failed to create game:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering game selection
    try {
      const response = await fetch(`/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchGames(); // Refresh the games list
      } else {
        console.error('Failed to delete game');
      }
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  const getGameStatus = (game: GameState) => {
    if (game.winner) {
      return `Winner: ${game.winner}`;
    }
    const moveCount = game.board.filter(cell => cell !== null).length;
    if (moveCount === 0) {
      return 'New Game';
    }
    return `In Progress (${game.currentPlayer}'s turn)`;
  };

  const getGameProgress = (game: GameState) => {
    const totalMoves = game.board.filter(cell => cell !== null).length;
    return `${totalMoves}/9 moves`;
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Tic Tac Toe Lobby</h1>

      <button
        onClick={createNewGame}
        disabled={loading}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '30px',
          opacity: loading ? 0.6 : 1
        }}
      >
        {loading ? 'Creating...' : 'New Game'}
      </button>

      {games.length === 0 ? (
        <div style={{
          padding: '40px',
          color: '#666',
          fontSize: '18px',
          border: '2px dashed #ddd',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          No games yet. Create your first game!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {games.map((game) => (
            <div
              key={game.id}
              onClick={() => onGameSelect(game.id)}
              style={{
                border: '2px solid #ddd',
                borderRadius: '10px',
                padding: '20px',
                cursor: 'pointer',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4CAF50';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#ddd';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <button
                onClick={(e) => deleteGame(game.id, e)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '25px',
                  height: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                title="Delete game"
              >
                ×
              </button>

              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#333' }}>
                Game {game.id.substring(0, 8)}...
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 30px)',
                gridTemplateRows: 'repeat(3, 30px)',
                gap: '2px',
                margin: '0 auto 15px auto',
                width: 'fit-content'
              }}>
                {game.board.map((cell, index) => (
                  <div
                    key={index}
                    style={{
                      width: '30px',
                      height: '30px',
                      backgroundColor: cell ? '#f0f0f0' : 'white',
                      border: '1px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                {getGameStatus(game)}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                {getGameProgress(game)}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchGames}
        style={{
          padding: '10px 20px',
          fontSize: '14px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ddd',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '30px'
        }}
      >
        Refresh Games
      </button>
    </div>
  );
}

export default GameLobby;