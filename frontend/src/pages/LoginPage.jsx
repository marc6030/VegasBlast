import { useState } from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://130.225.170.52:10171/api/login", {  // 🔥 Ændret fra localhost til ekstern IP
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Login succesfuld!");
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/dashboard";
            } else {
                setErrorMessage(data.error || "Forkert brugernavn eller kodeord!");
            }
        } catch (error) {
            setErrorMessage("Serverfejl, prøv igen senere!");
            console.error("Login-fejl:", error);
        }
    };

    return (
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
                {errorMessage && <p>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
