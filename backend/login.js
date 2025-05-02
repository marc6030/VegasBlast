const { getConnection } = require("./db");
const bcrypt = require("bcrypt");

const loginUser = async (username, password) => {
    const connection = await getConnection();

    try {
        console.log("✅ Forbundet til MariaDB");

        // 1️⃣ Hent brugeren (inkluder det hashede password)
        const query = `SELECT id, username, password, saldo FROM users WHERE username = ?`;
        const [rows] = await connection.execute(query, [username]);

        if (rows.length === 0) {
            console.log("❌ Bruger ikke fundet.");
            return { success: false, error: "Forkert brugernavn eller kodeord!" };
        }

        const user = rows[0];

        // 2️⃣ Sammenlign indtastet password med hash i databasen
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            console.log("❌ Forkert kodeord.");
            return { success: false, error: "Forkert brugernavn eller kodeord!" };
        }

        // 3️⃣ Login succesfuldt (returner IKKE password!)
        console.log(`✅ Bruger logget ind: ${user.username}`);
        return { 
            success: true, 
            user: { 
                id: user.id, 
                username: user.username, 
                saldo: user.saldo 
            } 
        };

    } catch (error) {
        console.error("🚨 Fejl ved login:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end();
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { loginUser };