const express = require('express');
const { getAllPreferences, addOrUpdatePreference } = require('../controllers/preferencesController');

const router = express.Router();

router.get('/', getAllPreferences); // Route for fetching all preferences
router.post('/', addOrUpdatePreference); // Route for adding/updating preferences

module.exports = router;
