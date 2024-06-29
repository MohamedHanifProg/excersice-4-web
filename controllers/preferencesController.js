const { check, validationResult } = require('express-validator');
const Preferences = require('../models/preferencesModel');
const fs = require('fs');
const path = require('path');

exports.getAllPreferences = async (req, res) => {
    try {
        const results = await Preferences.findAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addOrUpdatePreference = [
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
            const { user_id, start_date, end_date, destination, vacation_type } = req.body;
            const preference = { user_id, start_date, end_date, destination, vacation_type };

            await Preferences.createOrUpdate(preference);
            res.status(201).json({ message: 'Preference added/updated successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
];

exports.getVacation = async (req, res) => {
    try {
        const preferences = await Preferences.findAll();

        if (preferences.length < 5) {
            return res.status(400).json({ message: 'Not all users have submitted their preferences.' });
        }

        const destinations = {};
        const vacationTypes = {};
        let startDate = null;
        let endDate = null;

        preferences.forEach(pref => {
            destinations[pref.destination] = (destinations[pref.destination] || 0) + 1;
            vacationTypes[pref.vacation_type] = (vacationTypes[pref.vacation_type] || 0) + 1;

            if (!startDate || new Date(pref.start_date) > new Date(startDate)) {
                startDate = pref.start_date;
            }
            if (!endDate || new Date(pref.end_date) < new Date(endDate)) {
                endDate = pref.end_date;
            }
        });

        const selectedDestination = Object.keys(destinations).reduce((a, b) => destinations[a] > destinations[b] ? a : b);
        const selectedVacationType = Object.keys(vacationTypes).reduce((a, b) => vacationTypes[a] > vacationTypes[b] ? a : b);

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ message: 'No common date range found.' });
        }

        res.json({
            destination: selectedDestination,
            vacation_type: selectedVacationType,
            start_date: startDate,
            end_date: endDate
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
