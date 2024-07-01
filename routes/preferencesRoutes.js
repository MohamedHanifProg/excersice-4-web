const express = require('express');
const { getAllPreferences, addOrUpdatePreference } = require('../controllers/preferencesController');

const router = express.Router();

router.get('/', getAllPreferences);
router.post('/', addOrUpdatePreference);

module.exports = router;
