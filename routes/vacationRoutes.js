const express = require('express');
const getVacationResults = require('../controllers/vacationController');

const router = express.Router();

router.get('/results', async (req, res) => {
    const results = await getVacationResults();
    res.json(results);
});

module.exports = router;
