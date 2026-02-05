import { useState } from 'react';
import './App.css'
import SelectGame from './components/SelectGame';
import UltimateTicTacToe from './components/UltimateTicTacToe';

function App() {

  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)

  return (
    <>
      <div style={{
        paddingTop: '10vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h3>Ultimate Tic-Tac-Toe!</h3>
        {selectedGameId ?
          <UltimateTicTacToe
            selectedGameId={selectedGameId}
            setSelectedGameId={setSelectedGameId}
          /> :
          <SelectGame setSelectedGameId={setSelectedGameId} />}
      </div>
    </>
  )
}

export default App;
