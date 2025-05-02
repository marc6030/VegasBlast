const { getConnection } = require("./db");
const bcrypt = require("bcrypt");

const signupUser = async (username, password) => {
    const connection = await getConnection();

    try {
        console.log("✅ Forbundet til MariaDB");

        // 1️⃣ Tjek om brugernavn eksisterer
        const checkQuery = `SELECT id FROM users WHERE username = ?`;
        const [existingUsers] = await connection.execute(checkQuery, [username]);

        if (existingUsers.length > 0) {
            console.log("❌ Brugernavn allerede taget.");
            return { success: false, error: "Brugernavn er allerede i brug!" };
        }

        // 2️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3️⃣ Indsæt bruger
        const insertQuery = `INSERT INTO users (username, password, saldo) VALUES (?, ?, ?)`;
        const [result] = await connection.execute(insertQuery, [username, hashedPassword, 0]);

        console.log(`✅ Bruger oprettet: ${username}`);

        // 4️⃣ Hent brugerens id, username og saldo
        const selectQuery = `SELECT id, username, saldo FROM users WHERE id = ?`;
        const [rows] = await connection.execute(selectQuery, [result.insertId]);

        const user = rows[0];

        return { 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                saldo: user.saldo 
            } 
        };

    } catch (error) {
        console.error("🚨 Fejl ved signup:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end();
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { signupUser };