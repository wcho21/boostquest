const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const pool = require('#database/pool');
const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');

router.get('/:day',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res) => {
    const day = req.params.day;

    res.locals.day = day;
    res.locals.firstProblemSolved = false;
    res.locals.secondProblemSolved = false;

    if (!res.locals.signedIn) {
      res.render('day');
      return;
    }

    const firstProblemId = day + '1';
    const userId = res.locals.user.id;
    const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [firstProblemId, userId]);
    if (rows.length === 1 && rows[0].solved === 1) {
      res.locals.firstProblemSolved = true;
    }

    if (res.locals.firstProblemSolved) {
      const secondProblemId = day + '2';
      const userId = res.locals.user.id;
      const [rows] = await pool.query('SELECT * FROM problems_v1 WHERE pid = ? AND uid = ?', [secondProblemId, userId]);
      if (rows.length === 1 && rows[0].solved === 1) {
        res.locals.secondProblemSolved = true;
      }
    }

    res.render('day');
  });

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
