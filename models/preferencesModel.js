// preferencesModel.js

const db = require('../db');

class Preferences {
    static async findAll() {
        const [rows] = await db.query('SELECT * FROM tbl_43_preferences');
        return rows;
    }

    static async createOrUpdate(preference) {
        const { user_id, start_date, end_date, destination, vacation_type } = preference;
        // Format dates to YYYY-MM-DD
        const formattedStartDate = new Date(start_date).toISOString().split('T')[0];
        const formattedEndDate = new Date(end_date).toISOString().split('T')[0];

        // Delete existing preference for the user
        await db.query('DELETE FROM tbl_43_preferences WHERE user_id = ?', [user_id]);
        
        // Insert new preference
        const [rows] = await db.query(
            `INSERT INTO tbl_43_preferences (user_id, start_date, end_date, destination, vacation_type)
            VALUES (?, ?, ?, ?, ?)`,
            [user_id, formattedStartDate, formattedEndDate, destination, vacation_type]
        );
        return rows;
    }
}

module.exports = Preferences;
