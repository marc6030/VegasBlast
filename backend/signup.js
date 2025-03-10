const { getConnection } = require("./db"); // Importér databaseforbindelsen

// ** Funktion til at oprette en ny bruger (uden kryptering) **
const signupUser = async (username, password) => {
    const connection = await getConnection(); // Opret forbindelse

    try {
        console.log("✅ Forbundet til MariaDB");

        // 🔍 Tjek om brugernavnet allerede eksisterer
        const checkQuery = `SELECT id FROM users WHERE username = ?`;
        const [existingUsers] = await connection.execute(checkQuery, [username]);

        if (existingUsers.length > 0) {
            console.log("❌ Brugernavn allerede taget.");
            return { success: false, error: "Brugernavn er allerede i brug!" };
        }

        // 📝 Indsæt ny bruger
        const insertQuery = `INSERT INTO users (username, password, saldo) VALUES (?, ?, ?)`;
        await connection.execute(insertQuery, [username, password, 0]); // Startsaldo = 0

        console.log(`✅ Bruger oprettet: ${username}`);
        return { success: true, message: "Bruger oprettet succesfuldt!" };

    } catch (error) {
        console.error("🚨 Fejl ved signup:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end(); // Luk forbindelsen
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { signupUser };
