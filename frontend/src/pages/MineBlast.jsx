import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(parseFloat(10000).toFixed(2));
  const [bet, setBet] = useState("1000"); // Indsats
  const [placedBet, setPlacedBet] = useState(null); // Bekræftet indsats
  const [currentWinnings, setCurrentWinnings] = useState(0); // Gevinst
  const [gridSize, setGridSize] = useState(3); // Størrelse på spillepladen
  const [bombCount, setBombCount] = useState(2); // Antal bomber
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, [gridSize, bombCount]);

  const startGame = () => {
    // Ensure placedBet is at least 10 and is a valid number
    const numericBet = parseInt(bet); // Use parseInt to ensure it's an integer
    if (numericBet < 100 || isNaN(numericBet)) {
      alert("Indsatsen skal være mindst 100 coins!");
      return;
    }
    if (numericBet > balance){
      alert("saldo for lav");
      return;
    }
    
    setPlacedBet(numericBet); // Set the bet
    setBalance((prev) => Number((prev - numericBet).toFixed(0))); // Update balance after the bet, ensure no decimals
    setGameStarted(true);
    setGameOver(false);
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill("❓")));
    setBombs(generateBombs(gridSize, bombCount));
  };
  

  const handleBetChange = (e) => {
    const value = e.target.value;
  
    // Only allow numbers and prevent decimal points
    if (/^\d*$/.test(value)) {  // This regex allows only digits (0-9)
      setBet(value);
    }
  };
  
  

  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlacedBet(null);
    setCurrentWinnings(0);
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill("❓")));
    setBombs(generateBombs(gridSize, bombCount));
  };

  const stopGame = () => {
    setGameOver(true);
    revealGrid();
  };

  const handleCellClick = (row, col) => {
    if (!gameStarted || gameOver) return;

    const index = row * gridSize + col;

    if (bombs.includes(index)) {
      stopGame();
      return;
    }

    if (grid[row][col] === "✅") return;

    setGrid(prevGrid =>
      prevGrid.map((r, rowIndex) =>
        r.map((c, colIndex) => (rowIndex === row && colIndex === col ? "✅" : c))
      )
    );

    // Beregn chancen for at ramme en bombe
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount; // Sikre felter
    const clickedFields = grid.flat().filter(cell => cell === "✅").length + 1; // Inkluderer det nyligt klikkede felt
    const remainingSafeFields = safeFields - (clickedFields - 1);

    if (remainingSafeFields <= 0) return; // Undgå division med 0
    const multiplier = totalFields / remainingSafeFields;
    setCurrentWinnings(prev => Number((prev + placedBet / safeFields * multiplier).toFixed(2))); // Forøg gevinsten korrekt
  };

  // Afslører alle bomber
  const revealGrid = () => {
    setGrid(prevGrid =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          bombs.includes(rowIndex * gridSize + colIndex) ? "💣" : "✅"
        )
      )
    );
  };

  const cashOut = () => {
    setBalance(balance + placedBet + currentWinnings);
    stopGame();
  };

  return (
    <div className="mineblast-container">
      <h1>MineBlast 💣</h1>
      <p>Saldo: {balance} 💰</p>

      {!gameStarted ? (
        <>
          <p>Velkommen til MineBlast! Indsæt en indsats for at starte.</p>

          <input
            type="number"
            placeholder="Indtast din indsats"
            value={bet}
            onChange={handleBetChange}
            className="bet-input"
            disabled={placedBet !== null}
          />

          {placedBet !== null && <p>Din indsats: {placedBet} 💰</p>}

          <div>
            <label>Vælg grid-størrelse:</label>
            <select value={gridSize} onChange={(e) => {
              const newSize = parseInt(e.target.value);
              setBombCount(1);
              setGridSize(newSize);
            }}>
              <option value={3}>3x3</option>
              <option value={4}>4x4</option>
              <option value={5}>5x5</option>
            </select>

            <label>Vælg antal bomber:</label>
            <select value={bombCount} onChange={(e) => setBombCount(parseInt(e.target.value))}>
              {[...Array(gridSize * gridSize - 1).keys()].map(num => (
                <option key={num + 1} value={num + 1}>{num + 1}</option>
              ))}
            </select>
          </div>

          <button onClick={startGame}>Start</button>
        </>
      ) : (
        <>
          <p>Spillet er startet! Klik på felterne for at afsløre dem.</p>
          <p>Potentiel gevinst: {currentWinnings} 💰</p>

          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={gameOver}
                >
                  {cell}
                </button>
              ))
            )}
          </div>

          {!gameOver && <button onClick={cashOut}>Træk dig og tag din gevinst</button>}
          {gameOver && <button onClick={resetGame}>Start nyt spil</button>}
        </>
      )}
    </div>
  );
}

export default MineBlast;
