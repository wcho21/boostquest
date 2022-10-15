const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');
const submitAnswer = require('#middlewares/submit-answer');
const express = require('express');
const router = express.Router();

router.post('/:num',
  validateChallengeNumber,
  validateAccessTime,
  submitAnswer);

module.exports = router;
