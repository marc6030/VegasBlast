import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(100);
  const [placedBet, setPlacedBet] = useState(null);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [bombCount, setBombCount] = useState(1);
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set());
  const [inGame, setInGame] = useState(false);

  useEffect(() => {
      if (!inGame) {
          resetGame();
      }
  }, [gridSize, bombCount, inGame]);

  useEffect(() => {
      if (placedBet !== null && clickedCells.size > 0) {
          console.log("Calling calculateWinnings() from useEffect...");
          calculateWinnings();

          // Find den seneste klikkede celle
          const lastClick = [...clickedCells].pop();
          if (lastClick !== undefined) {
              const row = Math.floor(lastClick / gridSize);
              const col = lastClick % gridSize;
              updateGrid(row, col);
          }
      }
  }, [placedBet, clickedCells]);


  const handleGridSizeChange = (size) => {
    if (!gameStarted) {
      setGridSize(size);
      setBombCount(1);
      resetGame();
    }
  };

  const initializeGame = () => {
    const numericBet = parseInt(bet);
    if (numericBet < 100 || isNaN(numericBet) || numericBet > balance) {
      alert("Indsatsen skal være mindst 100 og ikke overstige saldoen!");
      return false;
    }

    setPlacedBet(numericBet);
    setBalance(balance - numericBet);
    setGameStarted(true);
    setInGame(true);
    setGameOver(false);
    setGrid(createEmptyGrid(gridSize));
    setBombs(generateBombs(gridSize, bombCount));
    setClickedCells(new Set());
    return true;
  };

  const generateBombs = (size, count) => {
    if (count >= size * size) count = size * size - 1;
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  const createEmptyGrid = (size) => {
    return Array(size).fill(null).map(() => Array(size).fill("❓"));
  };

  const resetGame = () => {
      if (inGame) return; // Undgå reset, hvis et spil er aktivt

      setGameStarted(false);
      setInGame(false);
      setGameOver(false);
      setPlacedBet(null);
      setCurrentWinnings(0);
      setGrid(createEmptyGrid(gridSize));
      setBombs(generateBombs(gridSize, bombCount));
      setClickedCells(new Set());
  };


  const handleCellClick = (row, col) => {
      if (!gameStarted) {
          if (!initializeGame()) {
              return;
          }
      }

      if (gameOver) {
          return;
      }

      if (clickedCells.has(row * gridSize + col)) {
          return;
      }

      const index = row * gridSize + col;

      if (bombs.includes(index)) {
          revealGrid();
          return;
      }

      setClickedCells(prev => new Set([...prev, index]));
  };

  const updateGrid = (row, col) => {
      const multiplier = getMultiplier(gridSize, bombCount, clickedCells);

      setGrid(prevGrid =>
          prevGrid.map((r, rowIndex) =>
              rowIndex === row
                  ? r.map((c, colIndex) =>
                      colIndex === col ? `x${multiplier}` : c
                  )
                  : r
          )
      );
  };

  const checkWin = () => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    if (clickedCells.size === safeFields) {
      setGameOver(true);
      alert("🎉 Du har vundet! Alle sikre felter er afsløret! 🎉");
    }
  };

  const getMultiplier = (gridSize, bombCount, clickedCells) => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    const clickedFields = clickedCells.size;

    if (clickedFields > safeFields) {
        return 0; // Returnér 0, hvis der klikkes for mange felter
    }

    let multiplier = 1;

    // Beregn den korrekte multiplikator baseret på akkumuleret sandsynlighed
    for (let i = 0; i < clickedFields; i++) {
        multiplier *= (totalFields - i) / (safeFields - i);
    }

    // Sikrer, at første klik giver en rimelig gevinst
    if (clickedCells.size === 0) {
        multiplier = totalFields / safeFields;
    }

    multiplier *= 0.97;
    multiplier -= 1; // Træk 1 fra, da det kun skal være gevinststigning

    return multiplier.toFixed(2); // Returnér multiplikatoren som en string med 2 decimaler
};

  const calculateWinnings = () => {
      const multiplier = getMultiplier(gridSize, bombCount, clickedCells);
      setCurrentWinnings(prev => Math.floor(prev + (placedBet * multiplier)));
  };

  const revealGrid = () => {
      setGrid(prevGrid =>
          prevGrid.map((row, rowIndex) =>
              row.map((cell, colIndex) =>
                  bombs.includes(rowIndex * gridSize + colIndex) ? "💣" : (clickedCells.has(rowIndex * gridSize + colIndex) ? cell : "✅")
              )
          )
      );
  };

  const cashOut = () => {
      setBalance(prevBalance => prevBalance + placedBet + currentWinnings);
      revealGrid();  // Afslører kun det aktuelle spil
      setGameOver(true);
      //setInGame(false);  // Nu er spillet slut, men vi resetter ikke!
  };


  return (
    <div className="mineblast-container">
      <h1>MineBlast 💣</h1>
      <p>Saldo: {balance} 💰</p>
      {!gameStarted ? (
        <input
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
        />
      ) : (
        <p>Indsat: {placedBet} 💰</p>
      )}
      <select value={gridSize} onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}>
        {[3, 4, 5].map(size => <option key={size} value={size}>{size}x{size}</option>)}
      </select>
      <select value={bombCount} onChange={(e) => !gameStarted && setBombCount(parseInt(e.target.value))}>
        {[...Array(gridSize * gridSize - 1).keys()].map(num => (
          <option key={num + 1} value={num + 1}>{num + 1}</option>
        ))}
      </select>
      <p>Potentiel gevinst: {currentWinnings} 💰</p>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button key={`${rowIndex}-${colIndex}`} onClick={() => handleCellClick(rowIndex, colIndex)} disabled={gameOver} className={cell === "💣" ? "bomb" : "safe"}>
              {cell}
            </button>
          ))
        )}
      </div>
      {!gameOver && <button onClick={cashOut}>Træk dig og tag din gevinst</button>}
      {gameOver && <button onClick={() => { setInGame(false); resetGame(); }}>Start nyt spil</button>}
    </div>
  );
}

export default MineBlast;
