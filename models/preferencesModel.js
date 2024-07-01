const db = require('../db');

class Preferences {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM tbl_43_preferences');
        return rows;
    }

    static async create(preference) {
        const { user_id, start_date, end_date, destination, vacation_type } = preference;
        const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
        const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

        const [rows] = await db.query(
            `INSERT INTO tbl_43_preferences (user_id, start_date, end_date, destination, vacation_type)
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, formattedStartDate, formattedEndDate, destination, vacation_type]
        );
        return rows;
    }

    static async update(preference) {
        const { user_id, start_date, end_date, destination, vacation_type } = preference;
        const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
        const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

        const [rows] = await db.query(
            `UPDATE tbl_43_preferences SET start_date = ?, end_date = ?, destination = ?, vacation_type = ?
            WHERE user_id = ?`,
            [formattedStartDate, formattedEndDate, destination, vacation_type, user_id]
        );
        return rows;
    }
}

module.exports = Preferences;
