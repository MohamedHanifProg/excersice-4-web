const { check, validationResult } = require('express-validator');
const Preferences = require('../models/preferencesModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');

// Fetch all preferences
exports.getAllPreferences = async (req, res) => {
    try {
        const results = await Preferences.findAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Add a preference
exports.addPreference = [
    // Validation rules
    check('user_id').isInt().withMessage('User ID must be an integer'),
    check('start_date').isISO8601().withMessage('Start date must be a valid date'),
    check('end_date').isISO8601().withMessage('End date must be a valid date'),
    check('destination').custom(value => {
        const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/destinations.json')));
        if (!destinations.includes(value)) {
            throw new Error('Invalid destination');
        }
        return true;
    }),
    check('vacation_type').custom(value => {
        const vacationTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vacationTypes.json')));
        if (!vacationTypes.includes(value)) {
            throw new Error('Invalid vacation type');
        }
        return true;
    }),
    check('access_code').isString().withMessage('Access code must be a string'),

    // Middleware to handle validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    // Controller logic
    async (req, res) => {
        try {
            const { user_id, start_date, end_date, destination, vacation_type, access_code } = req.body;
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            if (user.access_code !== access_code) {
                return res.status(400).json({ error: 'Invalid access code' });
            }

            const preference = {
                user_id,
                start_date: new Date(start_date).toISOString().split('T')[0],
                end_date: new Date(end_date).toISOString().split('T')[0],
                destination,
                vacation_type
            };

            // Ensure vacation duration is not more than a week
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
            if (duration > 7) {
                return res.status(400).json({ error: 'Vacation duration cannot exceed one week' });
            }

            await Preferences.create(preference);
            res.status(201).json({ message: 'Preference added successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Update a preference
exports.updatePreference = [
    // Validation rules
    check('user_id').isInt().withMessage('User ID must be an integer'),
    check('start_date').isISO8601().withMessage('Start date must be a valid date'),
    check('end_date').isISO8601().withMessage('End date must be a valid date'),
    check('destination').custom(value => {
        const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/destinations.json')));
        if (!destinations.includes(value)) {
            throw new Error('Invalid destination');
        }
        return true;
    }),
    check('vacation_type').custom(value => {
        const vacationTypes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/vacationTypes.json')));
        if (!vacationTypes.includes(value)) {
            throw new Error('Invalid vacation type');
        }
        return true;
    }),
    check('access_code').isString().withMessage('Access code must be a string'),

    // Middleware to handle validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    // Controller logic
    async (req, res) => {
        try {
            const { user_id, start_date, end_date, destination, vacation_type, access_code } = req.body;
            const user = await User.findById(user_id);

            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }

            if (user.access_code !== access_code) {
                return res.status(400).json({ error: 'Invalid access code' });
            }

            const preference = {
                user_id,
                start_date: new Date(start_date).toISOString().split('T')[0],
                end_date: new Date(end_date).toISOString().split('T')[0],
                destination,
                vacation_type
            };

            // Ensure vacation duration is not more than a week
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
            if (duration > 7) {
                return res.status(400).json({ error: 'Vacation duration cannot exceed one week' });
            }

            await Preferences.update(preference);
            res.status(200).json({ message: 'Preference updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

// Delete a preference
exports.deletePreference = async (req, res) => {
    res.status(403).json({ message: 'Users are not allowed to delete preferences.' });
};
