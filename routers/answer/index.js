const fs = require('fs/promises');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const { getProblemStatus, updateProblemAsSolved, updateProblemLastTriedAt } = require('#database/problems');
const dayjs = require('dayjs');
const express = require('express');
const router = express.Router();

const isBlocked = (lastTriedAtStr) => {
  const currentTime = dayjs();

  const lastTriedAt = dayjs(lastTriedAtStr);
  const blockedUntil = lastTriedAt.add(5, 'second');

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

router.post('/:day', async (req, res) => {
  if (!res.locals.signedIn) {
    throw new PageNotFoundError();
  }

  if (!('answer' in req.body)) {
    throw new PageNotFoundError();
  }

  const userId = res.locals.user.id;

  const day = req.params.day;

  const firstProblemId = day + '1';
  const firstProblem = await getProblemStatus(firstProblemId, userId);

  if (firstProblem.tried && isBlocked(firstProblem.lastTriedAt)) {
    res.locals.blocked = true;
    res.render('submit');
    return;
  }

  const userAnswer = req.body.answer;

  const inputCasesIdx = parseInt(day) - 1;
  const inputCase = req.session.user.inputCases[inputCasesIdx];

  if (!firstProblem.solved) {
    const correctAnswer = await isCorrectAnswer(firstProblemId, inputCase, userAnswer);
    res.locals.correctAnswer = correctAnswer;
    res.locals.blocked = false;

    if (correctAnswer) {
      await updateProblemAsSolved(firstProblemId, userId);
    } else {
      await updateProblemLastTriedAt(firstProblemId, userId);
    }

    res.render('submit');
    return;
  }

  const secondProblemId = day + '2';
  const secondProblem = await getProblemStatus(secondProblemId, userId);

  if (secondProblem.tried && isBlocked(secondProblem.lastTriedAt)) {
    res.locals.blocked = true;
    res.render('submit');
    return;
  }

  if (!secondProblem.solved) {
    const correctAnswer = await isCorrectAnswer(secondProblemId, inputCase, userAnswer);
    res.locals.correctAnswer = correctAnswer;
    res.locals.blocked = false;

    if (correctAnswer) {
      await updateProblemAsSolved(secondProblemId, userId);
    } else {
      await updateProblemLastTriedAt(secondProblemId, userId);
    }

    res.render('submit');
    return;
  }

  // all problems have been already solved
  throw new PageNotFoundError();
});

module.exports = router;
