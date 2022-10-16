const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');

const validateChallengeNumber = (req, res, next) => {
  const num = req.params.num;
  const validNum = /^[1-4]$/.test(num);

  if (!validNum) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateChallengeNumber;
