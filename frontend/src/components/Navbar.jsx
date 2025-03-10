import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";

function Navbar() {
    const { user, logout } = useContext(AuthContext); // 📌 Henter login-status fra global state

    return (
        <nav className="navbar">
            <h2>VegasBlast 🎰</h2>
            <ul className="nav-links">
                <li><Link to="/mineblast">MineBlast</Link></li>
                <li><Link to="/mineblastlightning">MineBlast Lightning</Link></li>
                {user ? (
                    // 📌 Hvis brugeren er logget ind, vis brugernavn, saldo + log ud-knap
                    <>
                        <li>👤 {user.username}</li>
                        <li>💰 {user.saldo} DKK</li>
                        <li><Link to="/change-saldo">ChangeSaldo</Link></li>
                        <li><button onClick={logout} className="logout-btn">Log ud</button></li>
                    </>
                ) : (
                  // 📌 Hvis brugeren ikke er logget ind, vis login-link
                  <>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/signup">Signup</Link></li>
                  </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
