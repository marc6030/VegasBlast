import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // 📌 Brug auth kontekst

const SaldoPage = () => {
    const { user } = useContext(AuthContext); // Hent brugerinfo
    const [saldo, setSaldo] = useState(user ? user.saldo : 0);
    const [message, setMessage] = useState("");

    const handleAddSaldo = async () => {
        if (!user) {
            setMessage("❌ Du skal være logget ind!");
            return;
        }

        try {
            const newSaldo = Math.round((saldo + 100) * 100) / 100; // 🔥 Fix floating point fejl
            const response = await fetch("http://130.225.170.52:10171/api/change-saldo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    newSaldo: newSaldo,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSaldo(newSaldo);
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
            <p>Din nuværende saldo: {saldo} kr.</p>
            <button onClick={handleAddSaldo}>Tilføj 100 kr.</button>
            {message && <p style={{ marginTop: "10px", color: message.includes("✅") ? "green" : "red" }}>{message}</p>}
        </div>
    );
};

export default SaldoPage;
