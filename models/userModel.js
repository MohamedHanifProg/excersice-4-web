const db = require('../db');

class User {
    static async findByUsername(username) {
        const [rows] = await db.query('SELECT * FROM tbl_43_users WHERE username = ?', [username]);
        return rows;
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM tbl_43_users WHERE id = ?', [id]);
        return rows[0]; // Return the first row, or undefined if no rows
    }

    static async create(user) {
        const { username, password } = user;
        const [result] = await db.query('INSERT INTO tbl_43_users (username, password) VALUES (?, ?)', [username, password]);
        return result;
    }

    static async updateAccessCode(id, newAccessCode) {
        const [result] = await db.query('UPDATE tbl_43_users SET access_code = ? WHERE id = ?', [newAccessCode, id]);
        return result;
    }
}

module.exports = User;
// succes api is running on render 