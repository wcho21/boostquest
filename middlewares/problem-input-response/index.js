const fs = require('fs/promises');
const path = require('path');
const inputCases = require('#database/inputCases');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');

module.exports = async (req, res) => {
  if (!res.locals.signedIn) {
    throw new PageNotFoundError();
  }

  const day = req.params.day;
  const userId = res.locals.user.id;
  const inputCase = await inputCases.fetch(userId, day);

  const challengeId = day + '0';

  const inputFilePath = path.join('./challenges/inputs', challengeId, inputCase + '.txt')
  const buffer = await fs.readFile(inputFilePath);
  const input = buffer.toString();

  res.type('text/plain');
  res.send(input);
};
