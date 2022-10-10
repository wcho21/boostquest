const { PageNotFoundError } = require('#express/errors.js');

const validateChallengeNumber = (req, res, next) => {
  const num = req.params.num;
  const validNum = /^[1-5]$/.test(num);

  if (!validNum) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateChallengeNumber;
