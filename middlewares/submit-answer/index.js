const fs = require('fs/promises');
const path = require('path');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const problems = require('#database/problems');
const inputCases = require('#database/inputCases');
const dayjs = require('dayjs');

const isBlocked = (lastTriedAtStr) => {
  const currentTime = dayjs();

  const lastTriedAt = dayjs(lastTriedAtStr);
  const blockedUntil = lastTriedAt.add(2, 'second');

  const blocked = currentTime.isBefore(blockedUntil);
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
      res.render('submit');
      return;
    }

    const correctAnswer = await isCorrectAnswer(problemId, inputCase, userAnswer);
    if (correctAnswer) {
      await problems.updateAsSolved(userId, problemId);

      res.locals.blocked = false;
      res.locals.correctAnswer = true;
      res.render('submit');
      return;
    } else {
      await problems.updateLastTriedTime(userId, problemId);

      res.locals.blocked = false;
      res.locals.correctAnswer = false;
      res.render('submit');
      return;
    }
  }

  // all problems have been already solved
  throw new PageNotFoundError();
};
