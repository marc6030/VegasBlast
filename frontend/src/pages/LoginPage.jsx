import { useState, useEffect } from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [user, setUser] = useState(null); // Tjek om brugeren er logget ind

    // 📌 Tjek om brugeren er logget ind, når komponenten indlæses
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
                localStorage.setItem("user", JSON.stringify(data.user)); // Gem bruger i localStorage
                setUser(data.user); // Opdater state
            } else {
                setErrorMessage(data.error || "❌ Forkert brugernavn eller kodeord!");
            }
        } catch (error) {
            setErrorMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Login-fejl:", error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user"); // Fjern brugerdata fra localStorage
        setUser(null); // Nulstil state
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {user ? (
                // 📌 Hvis brugeren er logget ind, vis velkomstbesked og logud-knap
                <div>
                    <h2>Velkommen, {user.username}!</h2>
                    <button onClick={handleLogout}>Log ud</button>
                </div>
            ) : (
                // 📌 Hvis brugeren ikke er logget ind, vis login-formularen
                <div>
                    <h2>Login</h2>
                    <form onSubmit={handleLogin}>
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
                        <button type="submit">Log ind</button>
                        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
