const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool.getConnection()
    .then(conn => {
        console.log('MySQL connected');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message);
    });

module.exports = pool;
