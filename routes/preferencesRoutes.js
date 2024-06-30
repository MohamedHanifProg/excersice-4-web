// preferencesRoutes.js

const express = require('express');
const { getAllPreferences, addOrUpdatePreference } = require('../controllers/preferencesController');

const router = express.Router();

router.get('/', getAllPreferences); // New route for fetching all preferences
router.post('/', addOrUpdatePreference);

module.exports = router;
