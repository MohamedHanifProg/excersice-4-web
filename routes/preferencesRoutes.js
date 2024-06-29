const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, preferencesController.getAllPreferences);
router.post('/', authMiddleware, preferencesController.addOrUpdatePreference);
router.get('/vacation', authMiddleware, preferencesController.getVacation); // New route for getting vacation details

module.exports = router;
