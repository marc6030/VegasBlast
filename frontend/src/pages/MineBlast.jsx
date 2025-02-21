import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState("");
  const [placedBet, setPlacedBet] = useState(null);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [bombCount, setBombCount] = useState(2);
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    resetGame();
  }, [gridSize, bombCount]);

  const startGame = () => {
    if (placedBet === null || placedBet <= 0) {
      alert("Du skal placere en gyldig indsats for at starte spillet!");
      return;
    }

    setBalance(balance - placedBet);
    setGameStarted(true);
    setGameOver(false);
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill("❓")));
    setBombs(generateBombs(gridSize, bombCount));
  };

  const handleBetChange = (e) => {
    setBet(e.target.value);
  };

  const confirmBet = () => {
    const numericBet = parseFloat(bet);
    if (numericBet > 0 && numericBet <= balance) {
      setPlacedBet(numericBet);
      setCurrentWinnings(0);
    } else {
      alert("Indsæt en gyldig indsats, som du har råd til!");
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

    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    const clickedFields = grid.flat().filter(cell => cell === "✅").length;

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
          <button onClick={confirmBet} disabled={placedBet !== null}>
            Bekræft indsats
          </button>

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
