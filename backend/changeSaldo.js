const { getConnection } = require("./db");

const changeSaldo = async (userId, newSaldo) => {
    const connection = await getConnection();

    try {
        console.log(`🔄 Opdaterer saldo for bruger ${userId}...`);

        const updateQuery = `UPDATE users SET saldo = ? WHERE id = ?`;
        const [result] = await connection.execute(updateQuery, [newSaldo, userId]);

        if (result.affectedRows > 0) {
            console.log(`✅ Saldo opdateret til ${newSaldo} kr.`);
            return { success: true };
        } else {
            console.log("❌ Ingen rækker opdateret (bruger findes ikke?).");
            return { success: false, error: "Bruger ikke fundet!" };
        }
    } catch (error) {
        console.error("🚨 Fejl ved saldo-opdatering:", error);
        return { success: false, error: "Serverfejl, prøv igen senere!" };
    } finally {
        await connection.end();
        console.log("🔌 Forbindelse lukket.");
    }
};

module.exports = { changeSaldo };
