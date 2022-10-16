// note: this middleware must come after valitdate-challenge-number middleware

const config = require('#config');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');
const dayjs = require('dayjs');

const validateAccessTime = (req, res, next) => {
  const day = parseInt(req.params.day); // assumed to be validated
  const dayOffsetFromFirstDay = day - 1;
  
  const firstDayOpenTime = dayjs(config.site.firstDayOpenTime);
  const openTime = firstDayOpenTime.add(dayOffsetFromFirstDay, 'day');

  const currentTime = dayjs();
  if (currentTime.isBefore(openTime)) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateAccessTime;
