import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // 📌 Importér AuthContext

const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { user, login, logout } = useContext(AuthContext); // 📌 Brug global login-state

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
            } else {
                setErrorMessage(data.error || "❌ Fejl ved oprettelse af bruger!");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Signup-fejl:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {user ? (
                // 📌 Hvis brugeren er logget ind, vis velkomstbesked og logud-knap
                <div>
                    <h2>Velkommen, {user.username}!</h2>
                    <button onClick={logout}>Log ud</button>
                </div>
            ) : (
                // 📌 Hvis brugeren ikke er logget ind, vis signup-formularen
                <div>
                    <h2>Opret bruger</h2>
                    <form onSubmit={handleSignup}>
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
                        <button type="submit">Opret</button>
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default SignupPage;
