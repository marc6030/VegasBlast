import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/MineBlast.css";

function MineBlast() {
  const { user, updateSaldo } = useContext(AuthContext);
  const userId = user?.id;

  const [balance, setBalance] = useState(user?.saldo || 0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bet, setBet] = useState(100);
  const [placedBet, setPlacedBet] = useState(null);
  const [gridSize, setGridSize] = useState(5);
  const [bombCount, setBombCount] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set());
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);

  // Sync balance with user at login/refresh
  useEffect(() => {
    if (user) setBalance(user.saldo);
  }, [user]);

  // Update balance in backend and globally
  const syncSaldo = async (newSaldo) => {
    try {
      await fetch("/api/change-saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newSaldo }),
      });
      updateSaldo(newSaldo);  // Update globally
      setBalance(newSaldo);   // Locally
    } catch (err) {
      console.error("Error updating saldo:", err);
    }
  };

  useEffect(() => {
    if (gameStarted && !gameOver) checkWin();
  }, [clickedCells]);

  const getMultiplier = (gridSize, bombCount, clickedCells) => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;
    const clickedFields = clickedCells.size;
    if (clickedFields === 0 || clickedFields > safeFields) return 0;
    let multiplier = 1;
    for (let i = 0; i < clickedFields; i++) {
      multiplier *= (totalFields - i) / (safeFields - i);
    }
    multiplier *= 0.97;
    multiplier -= 1;
    return multiplier.toFixed(2);
  };

  const calculateWinnings = () => {
    if (clickedCells.size === 0) return 0;
    const multiplier = getMultiplier(gridSize, bombCount, clickedCells);
    return Math.floor(placedBet * multiplier);
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
    setBalance(prev => prev - numericBet);
    setGameStarted(true);
    setGameOver(false);
    setClickedCells(new Set());
    setCurrentWinnings(0);
    setGrid(createEmptyGrid(gridSize));
    let bombs = generateBombs(gridSize, bombCount);
    setBombs(bombs);
  };

  const handleCellClick = (row, col) => {
    if (gameOver || clickedCells.has(row * gridSize + col)) return;
    const index = row * gridSize + col;

    if (bombs.includes(index)) {
      handleLoss();  // Lost
      return;
    }

    const newClickedCells = new Set([...clickedCells, index]);
    setClickedCells(newClickedCells);
    const multiplier = getMultiplier(gridSize, bombCount, newClickedCells);

    setGrid(prevGrid =>
      prevGrid.map((r, rowIndex) =>
        rowIndex === row
          ? r.map((c, colIndex) => colIndex === col ? `${multiplier}` : c)
          : r
      )
    );

    setCurrentWinnings(prev => prev + Math.floor(placedBet * multiplier));
  };

  const handleLoss = () => {
    revealGrid();
    syncSaldo(balance);  // Lost, balance already deducted
  };

  const handleWin = () => {
    const newSaldo = balance + currentWinnings + placedBet;
    syncSaldo(newSaldo);
    revealGrid();
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
      handleWin();
    }
  };

  if (!user) return <p>🔒 Du skal være logget ind for at spille MineBlast!</p>;

  return (
    <div className="mineblast-container">
      <div className="left-content">
        <h1 className="title">MineBlast 💣</h1>
        <p className="balance">Saldo: <span>{balance} 💰</span></p>

        <div className="setGame">
          <label>Spil Størrelse</label>
          <select value={gridSize} onChange={(e) => handleGridSizeChange(parseInt(e.target.value))}>
            {[3, 4, 5].map(size => <option key={size} value={size}>{size}x{size}</option>)}
          </select>

          <label>Antal Miner</label>
          <select value={bombCount} onChange={(e) => !gameStarted && setBombCount(parseInt(e.target.value))}>
            {[...Array(gridSize * gridSize - 1).keys()].map(num => (
              <option key={num + 1} value={num + 1}>{num + 1}</option>
            ))}
          </select>
        </div>

        <p className="winnings">Potentiel gevinst: <span>{gameStarted ? currentWinnings : 0} 💰</span></p>

        {!gameStarted ? (
          <div className="inputStart">
            <input
              type="number"
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              placeholder="Indsats"
            />
            <button onClick={startGame} className="start-btn">Start spil</button>
          </div>
        ) : (
          <p className="placedBet">Indsat: <span>{placedBet} 💰</span></p>
        )}

        {gameOver && <p className="game-over">Spillet er slut! Tryk på start for at prøve igen.</p>}

        {gameStarted && !gameOver && (
          <button onClick={handleWin} className="withdraw-btn">
            Træk dig og tag din gevinst
          </button>
        )}

        {gameOver && (
          <button onClick={() => {
            setGameStarted(false);
            setGameOver(false);
            setPlacedBet(null);
          }} className="restart-btn">
            Start nyt spil
          </button>
        )}
      </div>

      <div className="grid-container">
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
      </div>
    </div>
  );
}

export default MineBlast;
