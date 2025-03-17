import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/LoginPage.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { user, login, logout } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://130.225.170.52:10171/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user);
            } else {
                setErrorMessage(data.error || "❌ Forkert brugernavn eller kodeord!");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Login-fejl:", error);
        }
    };

    return (
        <div className="login-container">
            {user ? (
                <div className="welcome-box">
                    <h2>Velkommen, {user.username}!</h2>
                    <button onClick={logout} className="apple-button">Log ud</button>
                </div>
            ) : (
                <div className="form-box">
                    <h2>Login</h2>
                    <form onSubmit={handleLogin} className="login-form">
                        <input
                            type="text"
                            placeholder="Brugernavn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Kodeord"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="apple-button">Log ind</button>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
