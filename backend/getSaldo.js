const { getConnection } = require("./db");

const getSaldo = async (userId) => {
    const connection = await getConnection();

    try {
        const [rows] = await connection.execute("SELECT saldo FROM users WHERE id = ?", [userId]);

        if (rows.length > 0) {
            return { success: true, saldo: rows[0].saldo };
        } else {
            return { success: false, error: "Bruger ikke fundet!" };
        }
    } catch (error) {
        console.error("🚨 Fejl ved hentning af saldo:", error);
        return { success: false, error: "Serverfejl!" };
    } finally {
        await connection.end();
    }
};

module.exports = { getSaldo };
