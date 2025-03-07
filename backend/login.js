const { getConnection } = require("./db"); // Importér databaseforbindelsen

// ** Funktion til at verificere login **
const loginUser = async (username, password) => {
    const connection = await getConnection(); // Opret forbindelse

    try {
        console.log("✅ Forbundet til MariaDB");

        // 🔍 Hent brugeren fra databasen
        const query = `SELECT id, username, password, saldo FROM users WHERE username = ?`;
        const [rows] = await connection.execute(query, [username]);

        if (rows.length === 0) {
            console.log("❌ Bruger ikke fundet.");
            return { success: false, error: "Forkert brugernavn eller kodeord!" };
        }

        const user = rows[0];

        // 🔑 Sammenlign password direkte (ikke sikker løsning!)
        if (password !== user.password) {
            console.log("❌ Forkert kodeord.");
            return { success: false, error: "Forkert brugernavn eller kodeord!" };
        }

        console.log(`✅ Bruger logget ind: ${user.username}`);
        return { success: true, user: { id: user.id, username: user.username, saldo: user.saldo } };

    } catch (error) {
        console.error("🚨 Fejl ved login:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end(); // Luk forbindelsen
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { loginUser };
