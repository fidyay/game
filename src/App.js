import { useState } from "react";
import StartRestart from "./components/StartRestart";
import GameField from "./components/GameField";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLost, setGameLost] = useState(false);
  return (
    <div className="App">
      {!gameStarted && (
        <StartRestart gameLost={gameLost} setGameStarted={setGameStarted} />
      )}
      <GameField
        setGameLost={setGameLost}
        setGameStarted={setGameStarted}
        gameStarted={gameStarted}
        gameLostOnce={gameLost}
      />
    </div>
  );
}

export default App;
