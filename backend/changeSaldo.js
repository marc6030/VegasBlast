const { getConnection } = require('./db'); // Importér databaseforbindelsen

// ** Funktion til at ændre saldo **
const changeSaldo = async (userId, newSaldo) => {
    const connection = await getConnection(); // Opret forbindelse

    try {
        console.log('✅ Forbundet til MariaDB');

        const query = `UPDATE users SET saldo = ? WHERE id = ?`;
        const [result] = await connection.execute(query, [newSaldo, userId]);

        console.log(`💰 Saldo opdateret for bruger ID ${userId}. Rækker ændret: ${result.affectedRows}`);
    } catch (error) {
        console.error('🚨 Fejl ved opdatering af saldo:', error);
    } finally {
        await connection.end(); // Luk forbindelsen
        console.log('🔌 Forbindelse lukket.');
    }
};
