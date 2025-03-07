const express = require("express");
const { loginUser } = require("./loginUser"); // Importér login-funktion
const { changeSaldo } = require("./changeSaldo"); // Importér saldo-funktion

const router = express.Router(); // Opret en router

// 📌 Login-route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Brugernavn og kodeord kræves!" });
    }

    const result = await loginUser(username, password);

    if (result.success) {
        res.json({ message: "Login succesfuld!", user: result.user });
    } else {
        res.status(401).json({ error: result.error });
    }
});

// 📌 Route til at ændre saldo
router.post("/change-saldo", async (req, res) => {
    const { userId, newSaldo } = req.body;

    if (!userId || newSaldo === undefined) {
        return res.status(400).json({ error: "Mangler userId eller newSaldo" });
    }

    try {
        await changeSaldo(userId, newSaldo);
        res.json({ success: true, message: `Saldo opdateret til ${newSaldo}` });
    } catch (error) {
        console.error("Fejl ved saldo-opdatering:", error);
        res.status(500).json({ error: "Serverfejl ved opdatering af saldo" });
    }
});

module.exports = router;
