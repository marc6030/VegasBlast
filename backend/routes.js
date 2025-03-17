const express = require("express");
const { loginUser } = require("./login"); // Importér login-funktion
const { signupUser } = require("./signup"); // 📌 Importér signup-funktion
const { changeSaldo } = require("./changeSaldo"); // Importér saldo-funktion
const { getSaldo } = require("./getSaldo"); // Opret denne funktion

const router = express.Router(); // Opret en router

router.post("/get-saldo", async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "Mangler userId" });
    }

    const result = await getSaldo(userId);
    result.success ? res.json({ saldo: result.saldo }) : res.status(400).json({ error: result.error });
});

// 📌 Signup-route
router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Brugernavn og kodeord kræves!" });
    }

    const result = await signupUser(username, password);

    if (result.success) {
        res.json({ message: "Bruger oprettet succesfuldt!" });
    } else {
        res.status(400).json({ error: result.error });
    }
});

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

    const result = await changeSaldo(userId, newSaldo);
    result.success ? res.json({ success: true, message: `Saldo opdateret til ${newSaldo}` }) : res.status(400).json({ error: result.error });
});



module.exports = router;
