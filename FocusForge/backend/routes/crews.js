const express = require('express');
const router = express.Router();
const { createCrew, getCrewsLeaderboard } = require('../controllers/crewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create', protect, createCrew);
router.get('/leaderboard', protect, getCrewsLeaderboard);

module.exports = router;