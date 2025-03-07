import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);

  // 📌 Tjek om brugeren er logget ind, når Navbar loades
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Gem brugerinfo i state
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Fjern brugerdata
    setUser(null); // Nulstil state
    window.location.reload(); // Genindlæs siden for at opdatere navbar
  };

  return (
    <nav className="navbar">
      <h2>VegasBlast 🎰</h2>
      <ul className="nav-links">
        <li><Link to="/mineblast">MineBlast</Link></li>
        <li><Link to="/mineblastlightning">MineBlast Lightning</Link></li>

        {user ? (
          // 📌 Hvis brugeren er logget ind, vis brugernavn og log ud-knap
          <>
            <li>👤 {user.username}</li>
            <li><button onClick={handleLogout} className="logout-btn">Log ud</button></li>
          </>
        ) : (
          // 📌 Hvis brugeren IKKE er logget ind, vis login-link
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
