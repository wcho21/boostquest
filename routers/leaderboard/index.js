const express = require('express');
const leaderboardRenderer = require('#middlewares/leaderboard-renderer');

const router = express.Router();
router.get('/', leaderboardRenderer);

module.exports = router;
