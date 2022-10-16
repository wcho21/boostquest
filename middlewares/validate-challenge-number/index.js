const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');

const validateChallengeNumber = (req, res, next) => {
  const day = req.params.day;
  const validDay = /^[1-4]$/.test(day);

  if (!validDay) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateChallengeNumber;
