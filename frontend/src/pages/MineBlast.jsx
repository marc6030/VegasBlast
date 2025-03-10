import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  // Spillets tilstand
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [placedBet, setPlacedBet] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const [bombCount, setBombCount] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set());
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      checkWin();
    }
  }, [clickedCells]);

  const getMultiplier = (gridSize, bombCount, clickedCells) => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    const clickedFields = clickedCells.size;

    if (clickedFields === 0) return 0; // Hvis ingen felter er klikket, start på 0

    if (clickedFields > safeFields) return 0; // Forhindrer fejl (kan mulgvis slettes)

    let multiplier = 1;

    for (let i = 0; i < clickedFields; i++) {
      multiplier *= (totalFields - i) / (safeFields - i);
    }

    if (clickedCells.size === 0) {
      multiplier = totalFields / safeFields;
    }

    multiplier *= 0.97; // Husets fordel
    multiplier -= 1; // Fjern grundindsatsen

    return multiplier.toFixed(2);
  };

  const calculateWinnings = () => {
    if (clickedCells.size === 0) return 0; // Starter gevinsten korrekt på 0
    const multiplier = getMultiplier(gridSize, bombCount, clickedCells);
    return Math.floor(placedBet * multiplier);
  };

  // Funktion til at generere bomber tilfældigt
  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  // Funktion til at oprette et tomt grid
  const createEmptyGrid = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill("❓"));
  };

  // Funktion til at starte spillet
  const startGame = () => {
    const numericBet = parseInt(bet);
    if (numericBet < 100 || isNaN(numericBet) || numericBet > balance) {
      alert("Indsatsen skal være mindst 100 og ikke overstige saldoen!");
      return;
    }

    setPlacedBet(numericBet);
    setBalance(balance - numericBet);
    setGameStarted(true);
    setGameOver(false);
    setClickedCells(new Set());
    setCurrentWinnings(0);

    // Generer spilleplade og bomber
    setGrid(createEmptyGrid(gridSize));
    setBombs(generateBombs(gridSize, bombCount));
  };

  const handleCellClick = (row, col) => {
    if (gameOver || clickedCells.has(row * gridSize + col)) {
      return; // Hvis spillet er slut, eller cellen allerede er klikket, gør ingenting
    }

    const index = row * gridSize + col;

    if (bombs.includes(index)) {
      revealGrid();
      return;
    }

    // Opdater klikkede celler
    const newClickedCells = new Set([...clickedCells, index]);
    setClickedCells(newClickedCells);

    // Beregn ny multiplier baseret på de opdaterede klik
    const multiplier = getMultiplier(gridSize, bombCount, newClickedCells);

    // Opdater spillepladen, så multiplikatoren vises i cellen
    setGrid(prevGrid =>
      prevGrid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) =>
              colIndex === col ? `x${multiplier}` : c
            )
          : r
      )
    );

    // Opdater currentWinnings, så det også registrerer første klik
    setCurrentWinnings(prev => prev + Math.floor(placedBet * multiplier));
  };

  const revealGrid = () => {
    setGrid(prevGrid =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const index = rowIndex * gridSize + colIndex;
          if (bombs.includes(index)) return "💣"; // Vis bomber
          if (clickedCells.has(index)) return cell; // Behold klikkede felter med multiplier
          return "❓"; // Alle ikke-klikkede felter forbliver skjulte
        })
      )
    );
    setGameOver(true); // Stop spillet
  };

  const resetGame = () => {
    if (gameStarted) return; // Undgå reset, hvis spillet er i gang
    setGameOver(false);
    setPlacedBet(null);
    setGrid(createEmptyGrid(gridSize));
    setBombs(generateBombs(gridSize, bombCount));
    setClickedCells(new Set());
  };

  const handleGridSizeChange = (size) => {
    if (!gameStarted) {
      setGridSize(size);
      setBombCount(1);
      resetGame();
    }
  };

  const checkWin = () => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;

    if (clickedCells.size === safeFields) {
      // Hvis alle sikre felter er afsløret, giv spilleren deres gevinst og afslut spillet
      setBalance(prevBalance => prevBalance + currentWinnings + placedBet);
      revealGrid();
      setGameOver(true);
    }
  };

  return (
    <div className="mineblast-container">
      <h1>MineBlast 💣</h1>
      <p>Saldo: {balance} 💰</p>

      <select value={gridSize} onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}>
        {[3, 4, 5].map(size => <option key={size} value={size}>{size}x{size}</option>)}
      </select>

      <select value={bombCount} onChange={(e) => !gameStarted && setBombCount(parseInt(e.target.value))}>
        {[...Array(gridSize * gridSize - 1).keys()].map(num => (
          <option key={num + 1} value={num + 1}>{num + 1}</option>
        ))}
      </select>

      <p>Potentiel gevinst: {gameStarted ? currentWinnings : 0} 💰</p>

      {!gameStarted ? (
        <>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            placeholder="Indsats"
          />
          <button onClick={startGame}>Start spil</button>
        </>
      ) : (
        <p>Indsat: {placedBet} 💰</p>
      )}

      {gameOver && <p>Spillet er slut! Tryk på start for at prøve igen.</p>}

      {/* Vis spillepladen */}
      {gameStarted && (
        <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                disabled={gameOver}
                className={cell === "💣" ? "bomb" : "safe"}
              >
                {cell}
              </button>
            ))
          )}
        </div>
      )}

      {gameOver && (
        <button onClick={() => { setGameStarted(false); setGameOver(false); setPlacedBet(null); }}>
          Start nyt spil
        </button>
      )}

      {gameStarted && !gameOver && (
        <button onClick={() => {
          setBalance(prevBalance => prevBalance + currentWinnings + placedBet);
          revealGrid();
        }}>
          Træk dig og tag din gevinst
        </button>
      )}
    </div>
  );
}

export default MineBlast;
