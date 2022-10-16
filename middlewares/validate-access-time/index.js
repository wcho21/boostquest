// note: this middleware must come after valitdate-challenge-number middleware

const config = require('#config');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const dayjs = require('dayjs');

const validateAccessTime = (req, res, next) => {
  const num = req.params.num; // assumed to be validated
  const day = parseInt(num);
  const dayOffset = day - 1; // no offset for first day, 1d for second, etc.
  
  const firstDayOpenTime = dayjs(config.site.firstDayOpenTime);
  const openTime = firstDayOpenTime.add(dayOffset, 'day');

  const currentTime = dayjs();
  if (currentTime.isBefore(openTime)) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateAccessTime;
