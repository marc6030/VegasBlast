import React, { useState, useEffect } from "react";
import "../styles/MineBlast.css";

function MineBlast() {
  // Spillets tilstand
  const [gameStarted, setGameStarted] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [bet, setBet] = useState(1000);
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
    const clickedFields = clickedCells.size - 1;

    if (clickedFields > safeFields) return 0;

    let multiplier = 1;

    if (safeFields - clickedFields > 0) {
      multiplier = (totalFields - clickedFields) / (safeFields - clickedFields);
      multiplier *= 0.99;
      multiplier -= 1;
    } else {
      multiplier = 2;
    }

    return Math.floor(multiplier * 100) / 100;
  };

  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      let position = Math.floor(Math.random() * size * size);
      bombPositions.add(position);
    }
    return [...bombPositions];
  };

  const createEmptyGrid = (size) => {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill("❓"));
  };

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

    setGrid(createEmptyGrid(gridSize));
    let bombs = generateBombs(gridSize, bombCount);
    setBombs(bombs);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || clickedCells.has(row * gridSize + col)) {
      return;
    }

    const index = row * gridSize + col;

    if (bombs.includes(index)) {
      revealGrid();
      return;
    }

    const newClickedCells = new Set([...clickedCells, index]);
    setClickedCells(newClickedCells);

    const multiplier = getMultiplier(gridSize, bombCount, newClickedCells);

    setGrid((prevGrid) =>
      prevGrid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) =>
              colIndex === col ? `x${multiplier}` : c
            )
          : r
      )
    );

    setCurrentWinnings((prev) => prev + Math.floor(placedBet * multiplier));
  };

  const revealGrid = () => {
    setGrid((prevGrid) =>
      prevGrid.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const index = rowIndex * gridSize + colIndex;
          if (bombs.includes(index)) return "💣";
          if (clickedCells.has(index)) return cell;
          return "❓";
        })
      )
    );
    setGameOver(true);
  };

  const resetGame = () => {
    if (gameStarted) return;
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
      setBalance((prevBalance) => prevBalance + currentWinnings + placedBet);
      revealGrid();
    }
  };

  return (
    <div className="mineblast-container">
      <div className="left-content">
        <h1>MineBlast 💣</h1>
        <p>Saldo: {balance} 💰</p>

        {!gameStarted && (
          <div className="setGame">
            <div>
              <p>Grid</p>
              <select
                value={gridSize}
                onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}
              >
                {[3, 4, 5].map((size) => (
                  <option key={size} value={size}>
                    {size}x{size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p>Bomb</p>
              <select
                value={bombCount}
                onChange={(e) =>
                  !gameStarted && setBombCount(parseInt(e.target.value))
                }
              >
                {[...Array(gridSize * gridSize - 1).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="inputStart">
          {!gameStarted ? (
            <>
              <p>Indsats</p>
              <input
                type="number"
                value={bet}
                onChange={(e) => setBet(Number(e.target.value))}
                placeholder="Indsats"
              />
              <button onClick={startGame}>Start spil</button>
            </>
          ) : (
            <p>Gevinst: {currentWinnings + placedBet} 💰</p>
          )}
        </div>

        {gameOver && (
          <p className="game-over">
            Spillet er slut! Tryk på start for at prøve igen.
          </p>
        )}

        {gameOver && (
          <button
            onClick={() => {
              setGameStarted(false);
              setGameOver(false);
              setPlacedBet(null);
            }}
          >
            Start nyt spil
          </button>
        )}

        {gameStarted && !gameOver && (
          <button
            onClick={() => {
              setBalance(
                (prevBalance) => prevBalance + currentWinnings + placedBet
              );
              revealGrid();
            }}
          >
            Træk dig og tag din gevinst
          </button>
        )}
      </div>

      {gameStarted && (
        <div className="grid-container">
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
                  className={
                    cell === "💣" ? "bomb" : cell.includes("x") ? "safe" : ""
                  }
                >
                  {cell}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MineBlast;
