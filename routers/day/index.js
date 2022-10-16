const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');
const dayPageRenderer = require('#middlewares/day-page-renderer');

router.get('/:day',
  validateChallengeNumber,
  validateAccessTime,
  dayPageRenderer);

router.get('/:day/input',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res, next) => {
    if (!res.locals.signedIn) {
      throw new PageNotFoundError();
    }

    const day = req.params.day;
    const problemSetNumber = day + '0';
    const inputCasesIdx = parseInt(day) - 1;
    const inputCase = req.session.user.inputCases[inputCasesIdx];
    const buffer = await fs.readFile('./challenges/inputs/' + problemSetNumber + '/' + inputCase + '.txt');
    const input = buffer.toString();
    res.type('text/plain');
    res.send(input);
  });

module.exports = router;
