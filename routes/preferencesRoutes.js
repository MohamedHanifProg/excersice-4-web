const express = require('express');
const { getAllPreferences, addPreference, updatePreference, deletePreference } = require('../controllers/preferencesController');

const router = express.Router();

router.get('/', getAllPreferences); // Route for fetching all preferences
router.post('/', addPreference); // Route for adding preferences
router.put('/', updatePreference); // Route for updating preferences
router.delete('/', deletePreference); // Route for deleting preferences

module.exports = router;
