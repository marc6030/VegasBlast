import React, { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/MineBlastLightning.css";
import Lightning from "../assets/Lightning.png";


function MineBlastLightning() {
  const { user, updateSaldo } = useContext(AuthContext);
  const userId = user?.id;

  const [balance, setBalance] = useState(user?.saldo || 0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bet, setBet] = useState(1000);
  const [placedBet, setPlacedBet] = useState(null);
  const [gridSize, setGridSize] = useState(5);
  const [bombCount, setBombCount] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set());
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);
  const [x5Cell, setX5Cell] = useState(null); // Lightning felt

  useEffect(() => {
    if (user) setBalance(user.saldo);
  }, [user]);

  useEffect(() => {
    if (!gameStarted) {
      setGrid(createEmptyGrid(gridSize));
    }
  }, [gridSize, gameStarted]);

  const navigate = useNavigate();

  const goToMineBlast = () => {
    navigate("/MineBlast");
  };

  const goToMineBlastLightning = () => {
    navigate("/MineBlastLightning");
  };

  const syncSaldo = async (newSaldo) => {
    try {
      await fetch("/api/change-saldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newSaldo }),
      });
      updateSaldo(newSaldo);
      setBalance(newSaldo);
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

    if (clickedFields === 0) return 0;
    if (clickedFields > safeFields) return 0;

    let multiplier = 1;
    multiplier = (totalFields - clickedFields) / (safeFields - clickedFields);

    multiplier *= 0.92; // Husets fordel 8%
    multiplier -= 1; // Fjern grundindsats

    if (multiplier < 0.01) {
      multiplier = 0.01;
    }

    multiplier = multiplier.toFixed(2);

    return multiplier;
  };

  const calculateWinnings = () => {
    if (clickedCells.size === 0) return 0;
    const multiplier = getMultiplier(gridSize, bombCount, clickedCells);
    return Math.floor(placedBet * multiplier);
  };

  const generateBombs = (size, count) => {
    let bombPositions = new Set();
    while (bombPositions.size < count) {
      bombPositions.add(Math.floor(Math.random() * size * size));
    }
    return [...bombPositions];
  };

  const createEmptyGrid = (size) => {
    return Array(size)
      .fill(null)
      .map(() => Array(size).fill(""));
  };

  const startGame = () => {
    const numericBet = parseInt(bet);
    if (numericBet < 100 || isNaN(numericBet) || numericBet > balance) {
      alert("Indsatsen skal være mindst 100 og ikke overstige saldoen!");
      return;
    }

    setPlacedBet(numericBet);
    setBalance((prev) => prev - numericBet);
    setGameStarted(true);
    setGameOver(false);
    setClickedCells(new Set());
    setCurrentWinnings(0);
    const bombsGenerated = generateBombs(gridSize, bombCount);
    setBombs(bombsGenerated);
    setGrid(createEmptyGrid(gridSize));

    // Generér x5 felt på en sikker celle
    const totalFields = gridSize * gridSize;
    const safeCells = [];
    for (let i = 0; i < totalFields; i++) {
      if (!bombsGenerated.includes(i)) {
        safeCells.push(i);
      }
    }
    const randomX5 = safeCells[Math.floor(Math.random() * safeCells.length)];
    setX5Cell(randomX5);
  };

  const handleLoss = () => {
    revealGrid();
    syncSaldo(balance); // Lost, balance already deducted
  };

  const handleWin = () => {
    const newSaldo = balance + currentWinnings + placedBet;
    syncSaldo(newSaldo);
    revealGrid();
  };

  const handleCellClick = (row, col) => {
    if (gameOver || clickedCells.has(row * gridSize + col)) return;

    const index = row * gridSize + col;

    if (bombs.includes(index)) {
      handleLoss();
      return;
    }

    const newClickedCells = new Set([...clickedCells, index]);
    setClickedCells(newClickedCells);

    let multiplier;
    if (index === x5Cell) {
      multiplier = 5;
    } else {
      multiplier = getMultiplier(gridSize, bombCount, newClickedCells);
    }

    setGrid((prevGrid) =>
      prevGrid.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          const cellIndex = rowIndex * gridSize + colIndex;
          if (cellIndex === index) {
            return multiplier === 5 ? `x5🔥` : `x${multiplier}`;
          }
          return c;
        })
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
          if (index === x5Cell && !clickedCells.has(index)) return "x5🔥";
          if (clickedCells.has(index)) return cell;
          return "";
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
    setX5Cell(null);
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

  if (!user) return <Navigate to="/login" />;

  return (
    <div className="MineBlast-container-L">
      <div className="left-container-L">
        <div className="left-content-L">
          <div className="mineblast-logo-L">
            <img src={Lightning} alt="gameLogo" />
          </div>
          <div className="state-container-L">
            <button onClick={goToMineBlast} className="state-btn-L">
              Classic💣
            </button>
            <button onClick={goToMineBlastLightning} className="state-btn-L">
              Lightning⚡
            </button>
          </div>
          <p className="balance-L">
            Saldo: <span>{balance} 💰</span>
          </p>

          <div className="setGame-L">
            <label>Spil Størrelse</label>
            <div className="grid-size-L">
              <div className="grid-size-buttons-L">
                {[3, 4, 5].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleGridSizeChange(size)}
                    className="grid-size-btn-L"
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            <label>Antal Miner</label>
            <select
              value={bombCount}
              onChange={(e) => !gameStarted && setBombCount(parseInt(e.target.value))}
            >
              {[...Array(gridSize * gridSize - 1).keys()].map((num) => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>

          <div className="inputStart-L">
            {!gameStarted ? (
              <>
                <label>Indsats</label>
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Number(e.target.value))}
                  placeholder="Indsats" />
              </>
            ) : (
              <p className="placedBet-L">
                Gevinst: <span>{placedBet + currentWinnings} 💰</span>
              </p>
            )}
          </div>
          {gameStarted && !gameOver && (
            <button onClick={handleWin} className="withdraw-btn-L">
              Træk dig og tag din gevinst
            </button>
          )}

        </div>
      </div>

      <div className="grid-container-L">
        <div
          className="grid-L"
          style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
        >
          {!gameStarted && (
            <div className="overlay-L">
              <button onClick={startGame} className="start-btn-L">
                Start
              </button>
            </div>
          )}
          {gameOver && (
            <div className="overlay-L">
              <button
                onClick={() => {
                  setGameStarted(false);
                  setGameOver(false);
                  setPlacedBet(null);
                } }
                className="restart-btn-L"
              >
                Start nyt spil
              </button>
            </div>
          )}
          {grid.map((row, rowIndex) => row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => gameStarted && handleCellClick(rowIndex, colIndex)}
              disabled={!gameStarted || gameOver}
              className={cell === "💣"
                ? "bomb"
                : cell.includes("x5🔥")
                  ? "x5"
                  : cell.includes("x")
                    ? "safe"
                    : ""}
            >
              {cell}
            </button>
          ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MineBlastLightning;
