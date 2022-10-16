const fs = require('fs/promises');
const path = require('path');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const problems = require('#database/problems');
const inputCases = require('#database/inputCases');
const dayjs = require('dayjs');


const getBlockEndTime = (lastTriedAtStr) => {
  const blockTime = 1;
  const blockTimeUnit = 'minute';

  const lastTriedAt = dayjs(lastTriedAtStr);
  const blockEndTime = lastTriedAt.add(blockTime, blockTimeUnit);
  return blockEndTime;
}

const isBlocked = (lastTriedAtStr) => {
  const currentTime = dayjs();

  const blockEndTime = getBlockEndTime(lastTriedAtStr);
  const blocked = currentTime.isBefore(blockEndTime);
  return blocked;
}

const isCorrectAnswer = async (problemId, inputCase, userAnswer) => {
  const answerFilePath = path.join('./challenges/answers', problemId, inputCase + '.txt');
  const buffer = await fs.readFile(answerFilePath);
  const solutionAnswer = buffer.toString();

  const correct = userAnswer === solutionAnswer;
  return correct;
}

module.exports = async (req, res) => {
  if (!res.locals.signedIn) {
    throw new PageNotFoundError();
  }

  if (!('answer' in req.body)) {
    throw new PageNotFoundError();
  }

  const day = req.params.day;
  const userId = parseInt(res.locals.user.id);
  const userAnswer = req.body.answer;

  res.locals.day = day;
  res.locals.userAnswer = userAnswer;
  res.locals.blocked = false;
  res.locals.correctAnswer = false;

  const inputCase = await inputCases.fetch(userId, day);

  const firstProblemId = day + '1';
  const secondProblemId = day + '2';

  for (const problemId of [firstProblemId, secondProblemId]) {
    const status = await problems.getStatus(userId, problemId);

    if (status.solved) { // skip to next
      continue;
    }

    if (status.tried && isBlocked(status.lastTriedAt)) {
      res.locals.blocked = true;
      res.locals.blockEndTime = getBlockEndTime(status.lastTriedAt);
      res.render('answer');
      return;
    }

    const correctAnswer = await isCorrectAnswer(problemId, inputCase, userAnswer);
    if (correctAnswer) {
      await problems.updateAsSolved(userId, problemId);

      res.locals.correctAnswer = true;
      res.render('answer');
      return;
    } else {
      await problems.updateLastTriedTime(userId, problemId);

      res.render('answer');
      return;
    }
  }

  // all problems have been already solved
  throw new PageNotFoundError();
};
