import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";
import Logo from "../assets/Logo.png";

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
            <li className="nav-item">
              <button onClick={handleClick} className="button-coins">
                {user.saldo}
                <span className="emoji">💰</span>
              </button>
            </li>
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
