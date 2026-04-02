const express = require('express');
const router = express.Router();
const { unlockCharacter, getCollection, getLeaderboard } = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.post('/unlock', protect, unlockCharacter);
router.get('/collection', protect, getCollection);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
