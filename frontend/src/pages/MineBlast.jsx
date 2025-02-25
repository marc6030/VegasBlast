import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  const [balance, setBalance] = useState(1000);
  const [placedBet, setPlacedBet] = useState(100);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [bombCount, setBombCount] = useState(2);
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    resetGame();
  }, [gridSize, bombCount]);

  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  const resetGame = () => {
    setGameOver(false);
    setGameStarted(false);
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill("❓")));
    setBombs(generateBombs(gridSize, bombCount));
  };

  const handleCellClick = (row, col) => {
    if (gameOver) return;

    if (!gameStarted) {
      setGameStarted(true);
      setBalance(balance - placedBet);
    }

    const index = row * gridSize + col;
    if (bombs.includes(index)) {
      setGameOver(true);
      revealGrid();
      return;
    }

    setGrid(prevGrid =>
      prevGrid.map((r, rowIndex) =>
        r.map((c, colIndex) => (rowIndex === row && colIndex === col ? "✅" : c))
      )
    );

    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    const clickedFields = grid.flat().filter(cell => cell === "✅").length + 1;

    let multiplier = 10;
    for (let i = 0; i < clickedFields; i++) {
      multiplier *= (safeFields - i) / (totalFields - i);
    }
    multiplier = 1 / multiplier;

    setCurrentWinnings(prev => Math.floor(prev + placedBet * multiplier));
  };

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
    setGameOver(true);
  };

  return (
    <div className="mineblast-container">
      <h1>MineBlast 💣</h1>
      <p>Saldo: {balance} 💰</p>
      <p>Potentiel gevinst: {currentWinnings} 💰</p>

      <div>
        <label>Vælg grid-størrelse:</label>
        <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}>
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

      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
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
    </div>
  );
}

export default MineBlast;
