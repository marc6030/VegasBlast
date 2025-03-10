import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // 📌 Brug auth kontekst

const SaldoPage = () => {
    const { user, updateSaldo } = useContext(AuthContext); // 📌 Hent updateSaldo
    const [message, setMessage] = useState("");

    if (!user) {
        return <p>❌ Du skal være logget ind for at ændre saldo!</p>;
    }

    const handleAddSaldo = async () => {
        try {
            const newSaldo = Math.round(user.saldo + 100); // 🔥 Fix floating point fejl

            const response = await fetch("http://130.225.170.52:10171/api/change-saldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, newSaldo }),
            });

            const data = await response.json();
            if (response.ok) {
                updateSaldo(newSaldo); // 📌 Opdater saldo i AuthContext!
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
        <div style={{ textAlign: "center", marginTop: "150px" }}>
            <h2>Tilføj penge til saldo</h2>
            <p>Din nuværende saldo: {user.saldo} kr.</p> {/* 📌 Viser nu global saldo */}
            <button onClick={handleAddSaldo}>Tilføj 100 kr.</button>
            {message && <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        </div>
    );
};

export default SaldoPage;
