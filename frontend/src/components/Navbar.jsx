import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);

  // 📌 Funktion til at hente bruger fra localStorage
  const fetchUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  // 📌 Tjek om brugeren er logget ind ved component mount
  useEffect(() => {
    fetchUser();

    // 📌 Lyt efter ændringer i localStorage for at opdatere navbar dynamisk
    const handleStorageChange = () => fetchUser();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 📌 Log ud funktion
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null); // Opdater state
    window.dispatchEvent(new Event("storage")); // Fortæl alle komponenter, at localStorage er ændret
  };

  return (
    <nav className="navbar">
      <h2>VegasBlast 🎰</h2>
      <ul className="nav-links">
        <li><Link to="/mineblast">MineBlast</Link></li>
        <li><Link to="/mineblastlightning">MineBlast Lightning</Link></li>

        {user ? (
          // 📌 Hvis brugeren er logget ind, vis brugernavn + log ud-knap
          <>
            <li>👤 {user.username}</li>
            <li>👤 {user.saldo}</li>
            <li><button onClick={handleLogout} className="logout-btn">Log ud</button></li>
          </>
        ) : (
          // 📌 Hvis brugeren ikke er logget ind, vis login-link
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
