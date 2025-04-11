import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";
import Logo from "../assets/Logo.png";
import MineBlastGame from "../assets/MineBlastGame.png";
import Lightning from "../assets/Lightning.png";



function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/change-saldo");
  };

  const signups = () => {
    navigate("/signup");
  };

  const logins = () => {
    navigate("/login");
  };

  const game1 = () => {
    navigate("/MineBlast");
  };
  const game2 = () => {
    navigate("/MineBlastLightning");
  };

  return (
    <nav className="navbar fancy-shadow">
      <div className="logo-container">
        <Link to="/MainPage" className="logo-button">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <ul className="nav-links">
        {user ? (
          <>
            <button onClick={game1} className="game-button">
              <span className="MineBlast">MineBlast</span>
              <div className="navbarMineblast-logo">
                <img src={MineBlastGame} alt="gameLogo" />
              </div>
            </button>

            <button onClick={game2} className="game-button">
              <span className="MineBlast Lightning">MineBlast Lightning</span>
              <div className="navbarMineblast-logo">
                <img src={Lightning} alt="gameLogo" />
              </div>
            </button>

            <button onClick={handleClick} className="button-coins">
              {user.saldo}
              <span className="emoji">💰</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={logins}>Login</button>
            <button onClick={signups}>Signup</button>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
