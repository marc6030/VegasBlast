import { Link, useNavigate  } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import "../styles/Navbar.css";

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
            <Link to="/MainPage" className="logo-button">
                <h1 className="gradient-text">VegasBlast <span className="emoji">🎰</span></h1>
            </Link>
            <ul className="nav-links">
                {user ? (
                    <>
                        <li className="nav-item">
                            <button onClick={handleClick} className="button-coins">
                              {user.saldo}<span className="emoji">💰</span>
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
