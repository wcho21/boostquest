const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const pool = require('#database/pool');
const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');

router.get('/:num',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res) => {
    const num = req.params.num;

    let firstProblemSolved = false;
    let secondProblemSolved = false;
    if (res.locals.signedIn) {
      const firstProblemId = num + '1';
      const userId = res.locals.user.id;
      const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [firstProblemId, userId]);
      if (rows.length === 1 && rows[0].solved === 1) {
        firstProblemSolved = true;
      }
    }
    if (firstProblemSolved && res.locals.signedIn) {
      const secondProblemId = num + '2';
      const userId = res.locals.user.id;
      const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [secondProblemId, userId]);
      if (rows.length === 1 && rows[0].solved === 1) {
        secondProblemSolved = true;
      }
    }

    res.locals.firstProblemSolved = firstProblemSolved;
    res.locals.secondProblemSolved = secondProblemSolved;

    res.render('day', { num });
  });

router.get('/:num/input',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res, next) => {
    if (!res.locals.signedIn) {
      throw new PageNotFoundError();
    }

    const num = req.params.num;
    const problemSetNumber = num + '0';
    const inputCasesIdx = parseInt(num) - 1;
    const inputCase = req.session.user.inputCases[inputCasesIdx];
    const buffer = await fs.readFile('./challenges/inputs/' + problemSetNumber + '/' + inputCase + '.txt');
    const input = buffer.toString();
    res.type('text/plain');
    res.send(input);
  });

module.exports = router;
