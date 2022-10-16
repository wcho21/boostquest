const express = require('express');
const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');
const dayPageRenderer = require('#middlewares/day-page-renderer');
const problemInputResponse = require('#middlewares/problem-input-response');

const router = express.Router();

router.get('/:day',
  validateChallengeNumber,
  validateAccessTime,
  dayPageRenderer);

router.get('/:day/input',
  validateChallengeNumber,
  validateAccessTime,
  problemInputResponse);

module.exports = router;
