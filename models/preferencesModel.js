const db = require('../db');

const Preferences = {
    createOrUpdate: (preference, callback) => {
        const query = `
            INSERT INTO tbl_43_preferences (user_id, start_date, end_date, destination, vacation_type)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE start_date = VALUES(start_date), end_date = VALUES(end_date), destination = VALUES(destination), vacation_type = VALUES(vacation_type)
        `;
        db.query(query, [preference.user_id, preference.start_date, preference.end_date, preference.destination, preference.vacation_type], callback);
    },

    findByUserId: (user_id, callback) => {
        const query = `SELECT * FROM tbl_43_preferences WHERE user_id = ?`;
        db.query(query, [user_id], callback);
    },

    findAll: (callback) => {
        const query = `SELECT * FROM tbl_43_preferences`;
        db.query(query, callback);
    }
};

module.exports = Preferences;
