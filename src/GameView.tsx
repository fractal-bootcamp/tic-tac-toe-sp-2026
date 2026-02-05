import { useState, useEffect, useRef, useCallback } from "react";
import type { GameState } from "./tic-tac-toe";

interface GameViewProps {
  gameId: string;
  onBackToLobby: () => void;
}

function GameView({ gameId, onBackToLobby }: GameViewProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/games/${gameId}/ws`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'gameUpdate') {
          setGameState(data.gameState);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      console.log('WebSocket disconnected');

      if (event.code === 1008) {
        // Game not found
        console.error('Game not found');
        onBackToLobby();
      } else {
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
  }, [gameId, onBackToLobby]);

  const fetchGameState = async () => {
    try {
      const response = await fetch(`/api/games/${gameId}`);
      if (response.ok) {
        const data: GameState = await response.json();
        setGameState(data);
      } else if (response.status === 404) {
        console.error('Game not found');
        onBackToLobby();
      } else {
        console.error('Failed to fetch game state');
      }
    } catch (error) {
      console.error('Failed to fetch game state:', error);
    }
  };

  useEffect(() => {
    // Connect to WebSocket for live updates
    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [gameId, connectWebSocket]);

  const handleCellClick = async (position: number) => {
    if (!gameState || gameState.board[position] !== null || gameState.winner !== null || !isConnected) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ position }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Move failed:', error.error);
      }
      // Don't manually update state - WebSocket will handle it
    } catch (error) {
      console.error('Failed to make move:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetGame = async () => {
    if (!isConnected) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/games/${gameId}/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        console.error('Failed to reset game');
      }
      // Don't manually update state - WebSocket will handle it
    } catch (error) {
      console.error('Failed to reset game:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!gameState) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <button
          onClick={onBackToLobby}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back to Lobby
        </button>
        <div>Loading game...</div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={onBackToLobby}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '20px'
          }}
        >
          ← Back to Lobby
        </button>

        <span style={{
          fontSize: '14px',
          color: '#666',
          backgroundColor: '#f9f9f9',
          padding: '8px 12px',
          borderRadius: '5px',
          border: '1px solid #eee',
          marginRight: '10px'
        }}>
          Game: {gameState.id.substring(0, 8)}...
        </span>

        <span style={{
          fontSize: '14px',
          color: isConnected ? '#4caf50' : '#f44336',
          backgroundColor: isConnected ? '#e8f5e9' : '#ffebee',
          padding: '8px 12px',
          borderRadius: '5px',
          border: `1px solid ${isConnected ? '#4caf50' : '#f44336'}`,
          fontWeight: 'bold'
        }}>
          {isConnected ? '● Live' : '● Disconnected'}
        </span>
      </div>

      <h1>Tic Tac Toe</h1>

      {gameState.winner ? (
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>
          🎉 Winner: {gameState.winner}! 🎉
        </h2>
      ) : (
        <h2 style={{ marginBottom: '20px' }}>
          Current Player: <span style={{
            color: gameState.currentPlayer === 'X' ? '#ff6b6b' : '#4ecdc4',
            fontWeight: 'bold'
          }}>
            {gameState.currentPlayer}
          </span>
        </h2>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 120px)',
        gridTemplateRows: 'repeat(3, 120px)',
        gap: '4px',
        margin: '20px auto',
        width: 'fit-content',
        opacity: loading ? 0.6 : 1,
        border: '3px solid #333',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: '#f8f8f8'
      }}>
        {gameState.board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            style={{
              width: '120px',
              height: '120px',
              fontSize: '36px',
              fontWeight: 'bold',
              backgroundColor: cell ? '#f0f0f0' : 'white',
              border: '2px solid #333',
              borderRadius: '8px',
              cursor: cell || gameState.winner || loading || !isConnected ? 'not-allowed' : 'pointer',
              color: cell === 'X' ? '#ff6b6b' : cell === 'O' ? '#4ecdc4' : 'transparent',
              transition: 'all 0.2s ease',
              boxShadow: cell || gameState.winner || loading ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
            }}
            disabled={cell !== null || gameState.winner !== null || loading || !isConnected}
            onMouseEnter={(e) => {
              if (!cell && !gameState.winner && !loading && isConnected) {
                e.currentTarget.style.backgroundColor = '#e8f5e8';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cell && !gameState.winner && !loading && isConnected) {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {cell}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={resetGame}
          disabled={loading || !isConnected}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            marginRight: '15px',
            opacity: loading || !isConnected ? 0.6 : 1,
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading || !isConnected ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading && isConnected) e.currentTarget.style.backgroundColor = '#f57c00';
          }}
          onMouseLeave={(e) => {
            if (!loading && isConnected) e.currentTarget.style.backgroundColor = '#ff9800';
          }}
        >
          {loading ? 'Loading...' : 'Reset Game'}
        </button>

        <button
          onClick={fetchGameState}
          disabled={loading}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            opacity: loading ? 0.6 : 1,
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#1976d2';
          }}
          onMouseLeave={(e) => {
            if (!loading) e.currentTarget.style.backgroundColor = '#2196f3';
          }}
        >
          Refresh
        </button>
      </div>

      {gameState.winner && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e8f5e9',
          border: '2px solid #4caf50',
          borderRadius: '10px',
          color: '#2e7d32',
          fontWeight: 'bold'
        }}>
          Game Over! {gameState.winner} wins! 🏆
        </div>
      )}
    </div>
  );
}

export default GameView;