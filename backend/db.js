require('dotenv').config();  // Hent miljøvariabler fra .env
const mysql = require('mysql2/promise');

const CryptoJS = require('crypto-js');

const secret = process.env.secretKey;

const encryptedPassword = process.env.encryptedPassword;

const decrypted = CryptoJS.AES.decrypt(encryptedPassword, secret);

const dbPassword = decrypted.toString(CryptoJS.enc.Utf8);

const getConnection = async () => {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: dbPassword,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
};

module.exports = { getConnection };
