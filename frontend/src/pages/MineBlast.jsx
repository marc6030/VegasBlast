import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // <-- Importér AuthContext
import "../styles/MineBlast.css";

function MineBlast() {
  const { user, updateSaldo } = useContext(AuthContext); // Hent user og updateSaldo fra context

  if (!user) {
    return <p>Indlæser brugerdata...</p>; // Håndter hvis user er null
  }

  const [gameStarted, setGameStarted] = useState(false);
  const [bet, setBet] = useState(100);
  const [placedBet, setPlacedBet] = useState(null);
  const [gridSize, setGridSize] = useState(3);
  const [bombCount, setBombCount] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [clickedCells, setClickedCells] = useState(new Set());
  const [grid, setGrid] = useState([]);
  const [bombs, setBombs] = useState([]);
  const [currentWinnings, setCurrentWinnings] = useState(0);

  const userId = user.id; // Hent brugerens ID
  const [balance, setBalance] = useState(user.saldo); // Brug user.saldo

  useEffect(() => {
    if (gameStarted && !gameOver) {
      checkWin();
    }
  }, [clickedCells]);

  const updateSaldoInDB = async (newSaldo) => {
    try {
      const response = await fetch("/api/changeSaldo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newSaldo }),
      });

      const data = await response.json();
      if (data.success) {
        updateSaldo(newSaldo); // Opdater saldo i context
        setBalance(newSaldo); // Opdater balance lokalt
      } else {
        console.error("❌ Fejl ved opdatering af saldo:", data.error);
      }
    } catch (error) {
      console.error("🚨 Serverfejl ved saldo-opdatering:", error);
    }
  };

  const startGame = () => {
    const numericBet = parseInt(bet);
    if (numericBet < 100 || isNaN(numericBet) || numericBet > balance) {
      alert("Indsatsen skal være mindst 100 og ikke overstige saldoen!");
      return;
    }

    const newBalance = balance - numericBet;
    setBalance(newBalance);
    updateSaldoInDB(newBalance); // Opdater saldo i databasen

    setPlacedBet(numericBet);
    setGameStarted(true);
    setGameOver(false);
    setClickedCells(new Set());
    setCurrentWinnings(0);

    setGrid(createEmptyGrid(gridSize));
    setBombs(generateBombs(gridSize, bombCount));
  };

  const cashOut = () => {
    const newBalance = balance + currentWinnings + placedBet;
    setBalance(newBalance);
    updateSaldoInDB(newBalance); // Opdater saldo i databasen

    revealGrid();
  };

  const checkWin = () => {
    const totalFields = gridSize * gridSize;
    const safeFields = totalFields - bombCount;

    if (clickedCells.size === safeFields) {
      const newBalance = balance + currentWinnings + placedBet;
      setBalance(newBalance);
      updateSaldoInDB(newBalance); // Opdater saldo i databasen

      revealGrid();
      setGameOver(true);
    }
  };

  return (
    <div className="mineblast-container">
      <h1>MineBlast 💣</h1>
      <p>Saldo: {balance} 💰</p>

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

      {gameStarted && !gameOver && (
        <button onClick={cashOut}>Træk dig og tag din gevinst</button>
      )}
    </div>
  );
}

export default MineBlast;
