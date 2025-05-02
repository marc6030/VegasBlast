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
            // 1. First make the signup request
            const signupResponse = await fetch("http://130.225.170.52:10171/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const signupData = await signupResponse.json();

            if (!signupResponse.ok) {
                setErrorMessage(signupData.error || "❌ Fejl ved oprettelse af bruger!");
                return;
            }

            // 2. If signup successful, automatically log in
            const loginResponse = await fetch("http://130.225.170.52:10171/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const loginData = await loginResponse.json();

            if (loginResponse.ok) {
                login(loginData.user); // Update AuthContext with the logged-in user
                setSuccessMessage("✅ Bruger oprettet og logget ind!");
            } else {
                setErrorMessage(loginData.error || "❌ Auto-login fejlede, log venligst ind manuelt");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Signup/Login fejl:", error);
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