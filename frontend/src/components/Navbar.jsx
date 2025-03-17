import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h1>VegasBlast 🎰</h1>
      <ul className="nav-links">
        <li><Link to="/mineblast">MineBlast</Link></li>
        <li><Link to="/mineblastlightning">MineBlast Lightning</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
