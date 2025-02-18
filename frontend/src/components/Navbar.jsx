import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>VegasBlast 🎰</h2>
      <ul className="nav-links">
        <li><Link to="/mineblast">MineBlast</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
