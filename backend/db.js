require('dotenv').config();  // Hent miljøvariabler fra .env
const mysql = require('mysql2/promise');

const getConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
};

module.exports = { getConnection };
