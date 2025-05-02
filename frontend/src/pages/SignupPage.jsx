import { useState, useContext } from "react";
import { Navigate } from "react-router-dom"; // <-- tilføj
import { AuthContext } from "../context/AuthContext";
import "../styles/SignupPage.css";

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { user, login, logout } = useContext(AuthContext);

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("http://130.225.170.52:10171/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                login(data.user); // 🔥 log brugeren ind direkte
            } else {
                setErrorMessage(data.error || "❌ Fejl ved oprettelse af bruger!");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Signup-fejl:", error);
        }
    };

    if (user) return <Navigate to="/MineBlast" />; // 🔥 redirect hvis logget ind

    return (
        <div className="signup-container">
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
                </form>
            </div>
        </div>
    );
};

export default SignupPage;