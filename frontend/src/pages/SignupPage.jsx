import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/SignupPage.css";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { user, login, logout } = useContext(AuthContext);

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await fetch("http://130.225.170.52:10171/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("✅ Bruger oprettet succesfuldt! Log ind nu.");
                login(data.user);
                return <Navigate to="/MineBlast" />;
            } else {
                setErrorMessage(data.error || "❌ Fejl ved oprettelse af bruger!");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Signup-fejl:", error);
        }
    };

    return (
        <div className="signup-container">
            {user ? (
                <div className="signup-welcome-box">
                    <h2>Velkommen, {user.username}!</h2>
                    <button onClick={logout} className="signup-button">Log ud</button>
                </div>
            ) : (
                <div className="signup-form-box">
                    <h2>Opret bruger</h2>
                    <form onSubmit={handleSignup} className="signup-form">
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
                        <button type="submit" className="signup-button">Opret</button>
                        {errorMessage && <p className="signup-error-message">{errorMessage}</p>}
                        {successMessage && <p className="signup-success-message">{successMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default SignupPage;
