const db = require('../db');
const bcrypt = require('bcryptjs');

const User = {
    create: async (user) => {
        const { username, password } = user;
        if (!username || !password) {
            throw new Error('Username and password are required.');
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const accessCode = Math.random().toString(36).substring(2, 15);

        const query = `INSERT INTO tbl_43_users (username, password, access_code) VALUES (?, ?, ?)`;
        await db.query(query, [username, hashedPassword, accessCode]);
    },

    findByUsername: async (username) => {
        const query = `SELECT * FROM tbl_43_users WHERE username = ?`;
        const [results] = await db.query(query, [username]);
        return results;
    }
};

module.exports = User;
