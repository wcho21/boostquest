const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');
const submitAnswer = require('#middlewares/submit-answer');
const solveLastProblem = require('#middlewares/solve-last-problem');
const express = require('express');
const router = express.Router();

router.post('/:day',
  validateChallengeNumber,
  validateAccessTime,
  submitAnswer);

router.get('/:day',
  validateChallengeNumber,
  validateAccessTime,
  solveLastProblem);

module.exports = router;
