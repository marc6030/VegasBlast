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

        // 2️⃣ Hash password med bcrypt (10 salt rounds er standard)
        const hashedPassword = await bcrypt.hash(password, 10); 

        // 3️⃣ Indsæt bruger med HASHET password
        const insertQuery = `INSERT INTO users (username, password, saldo) VALUES (?, ?, ?)`;
        await connection.execute(insertQuery, [username, hashedPassword, 0]);

        console.log(`✅ Bruger oprettet: ${username}`);
        return { success: true, message: "Bruger oprettet succesfuldt!" };

    } catch (error) {
        console.error("🚨 Fejl ved signup:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end();
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { signupUser };