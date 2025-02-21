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

  // Initialiserer spillet
  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    setBombCount(1); // Sætter bombCount til 1, når gridSize ændres
  }, [gridSize]);

  const startGame = () => {
    // Ensure placedBet is at least 10 and is a valid number
    const numericBet = parseInt(bet); // Use parseInt to ensure it's an integer
    if (numericBet < 100 || isNaN(numericBet)) {
      alert("Indsatsen skal være mindst 100 coins!");
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
  
    // Allow numbers with up to 2 decimal places
    if (/^\d+(\.\d{0,2})?$/.test(value)) {  // This regex allows digits with up to 2 decimal places
      setBet(value);
    }
  };
  
  
  

  // Genererer tilfældige bombepositioner
  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  // Nulstiller spillet
  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setPlacedBet(null);
    setCurrentWinnings(0);
    setGrid(Array(gridSize).fill(null).map(() => Array(gridSize).fill("❓")));
    setBombs(generateBombs(gridSize, bombCount));
  };

  // Funktion til at stoppe spillet
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

    // Tjek om feltet allerede er afsløret
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

  // Spilleren trækker sig og får sin gevinst
  const cashOut = () => {
    setBalance(balance + placedBet + currentWinnings);
    stopGame();
    //resetGame();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold">MineBlast 💣</h1>
      <p className="text-lg font-semibold">Saldo: {balance} 💰</p>

      {!gameStarted ? (
        <>
          <p>Velkommen til MineBlast! Indsæt en indsats for at starte.</p>

          {/* Indsats-input */}
          <div className="bet-section">
            <input
              type="number"
              placeholder="Indtast din indsats"
              value={bet}
              onChange={handleBetChange}
              className="p-2 border border-gray-500 rounded"
              disabled={placedBet !== null}
            />
          </div>

          {/* Viser den bekræftede indsats */}
          {placedBet !== null && <p className="mt-2">Din indsats: {placedBet} 💰</p>}

          {/* Sværhedsgrad */}
          <div className="mt-4">
            <label>Vælg grid-størrelse:</label>
            <select value={gridSize} onChange={(e) => setGridSize(parseInt(e.target.value))}>
              <option value={3}>3x3</option>
              <option value={4}>4x4</option>
              <option value={5}>5x5</option>
            </select>

            <label className="ml-4">Vælg antal bomber:</label>
            <select value={bombCount} onChange={(e) => setBombCount(parseInt(e.target.value))}>
              {[...Array(gridSize * gridSize - 1).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          <button onClick={startGame} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Start spil
          </button>
        </>
      ) : (
        <>
          <p>Spillet er startet! Klik på felterne for at afsløre dem.</p>
          <p className="text-green-500">Potentiel gevinst: {currentWinnings} 💰</p>

          {/* Spillepladen */}
          <div
            className="grid mt-4"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gap: "5px",
            }}
          >
            {grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className="p-4 border border-gray-500 text-2xl"
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  disabled={gameOver}
                >
                  {cell}
                </button>
              ))
            )}
          </div>

          {!gameOver && (
            <button
              onClick={cashOut}
              disabled={gameOver}
              className="mt-4 p-2 bg-yellow-500 text-white rounded"
            >
              Træk dig og tag din gevinst
            </button>
          )}

          {gameOver && <p className="text-red-500 mt-4">Spillet er slut! Tryk på knappen for at starte forfra.</p>}
          {gameOver && (
            <button onClick={resetGame} className="mt-4 p-2 bg-gray-500 text-white rounded">
              Start nyt spil
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default MineBlast;
