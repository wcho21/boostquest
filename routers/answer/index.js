const fs = require('fs/promises');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const { getProblemStatus, updateProblemAsSolved, updateProblemLastTriedAt } = require('#database/problems');
const validateChallengeNumber = require('#middlewares/validate-challenge-number');
const validateAccessTime = require('#middlewares/validate-access-time');
const dayjs = require('dayjs');
const express = require('express');
const router = express.Router();

const isBlocked = (lastTriedAtStr) => {
  const currentTime = dayjs();

  const lastTriedAt = dayjs(lastTriedAtStr);
  const blockedUntil = lastTriedAt.add(2, 'second');

  const blocked = currentTime.isBefore(blockedUntil);
  return blocked;
}

const isCorrectAnswer = async (problemId, inputCaseId, userAnswer) => {
  const answerFilePath = `./challenges/answers/${problemId}/${inputCaseId}.txt`;
  const buffer = await fs.readFile(answerFilePath);
  const exactAnswer = buffer.toString();

  const correct = userAnswer === exactAnswer;
  return correct;
}

router.post('/:num',
  validateChallengeNumber,
  validateAccessTime,
  async (req, res) => {
    if (!res.locals.signedIn) {
      throw new PageNotFoundError();
    }

    if (!('answer' in req.body)) {
      throw new PageNotFoundError();
    }

    const day = req.params.num;
    const inputCasesIdx = parseInt(day) - 1;
    const inputCase = req.session.user.inputCases[inputCasesIdx];
    const userAnswer = req.body.answer;
    const userId = res.locals.user.id;

    const firstProblemId = day.toString() + '1';
    const secondProblemId = day.toString() + '2';

    for (const problemId of [firstProblemId, secondProblemId]) {
      const status = await getProblemStatus(problemId, userId);

      if (status.solved) {
        continue;
      }

      if (status.tried && isBlocked(status.lastTriedAt)) {
        res.locals.blocked = true;
        res.render('submit');
        return;
      }

      const correctAnswer = await isCorrectAnswer(problemId, inputCase, userAnswer);
      if (correctAnswer) {
        await updateProblemAsSolved(problemId, userId);

        res.locals.blocked = false;
        res.locals.correctAnswer = true;
        res.render('submit');
        return;
      } else {
        await updateProblemLastTriedAt(problemId, userId);

        res.locals.blocked = false;
        res.locals.correctAnswer = false;
        res.render('submit');
        return;
      }
    }

    // all problems have been already solved
    throw new PageNotFoundError();
  });

module.exports = router;
