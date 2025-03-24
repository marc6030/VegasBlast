import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/SaldoPage.css"; // Eller AuthPage.css

const SaldoPage = () => {
    const { user, updateSaldo, logout } = useContext(AuthContext);
    const [message, setMessage] = useState("");

    if (!user) {
        return (
            <div className="saldo-container">
                <div className="saldo-box">
                    <p className="saldo-message-error">❌ Du skal være logget ind for at ændre saldo!</p>
                </div>
            </div>
        );
    }

    const handleAddSaldo = async () => {
        try {
            const currentSaldo = Math.round(user.saldo);
            const newSaldo = Math.round(currentSaldo + 100);

            const response = await fetch("http://130.225.170.52:10171/api/change-saldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, newSaldo }),
            });

            const data = await response.json();
            if (response.ok) {
                updateSaldo(newSaldo);
                setMessage(`✅ Saldo opdateret! Ny saldo: ${newSaldo} kr.`);
            } else {
                setMessage(data.error || "❌ Fejl ved saldo-opdatering!");
            }
        } catch (error) {
            setMessage("❌ Serverfejl, prøv igen senere!");
            console.error("Saldo-fejl:", error);
        }
    };

    return (
        <div className="saldo-container">
            <div className="saldo-box">
                <h2>Hej, {user.username}!</h2>
                <h2>Tilføj penge til saldo</h2>
                <h3 className="saldo-display">Saldo: {user.saldo} coins</h3>
                <button onClick={handleAddSaldo} className="saldo-button">Tilføj 100 coins</button>
                {message && (
                    <p className={message.includes("✅") ? "saldo-message-success" : "saldo-message-error"}>
                        {message}
                    </p>
                )}
            </div>
            <div className="saldo-box">
              <button onClick={logout}>Log ud</button>
            </div>
        </div>
    );
};

export default SaldoPage;
