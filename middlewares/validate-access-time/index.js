// note: this middleware must come after valitdate-challenge-number middleware

const config = require('../../config');
const { PageNotFoundError } = require('../../express/errors.js');
const dayjs = require('dayjs');

const validateAccessTime = (req, res, next) => {
  const num = req.params.num; // assumed to be validated
  const day = parseInt(num);
  const dayOffset = day - 1; // no offset for first day, 1d for second, etc.
  
  const firstDayOpenTime = dayjs(config.site.firstDayOpenTime);
  const openTime = firstDayOpenTime.add(dayOffset, 'day');

  const currentTime = dayjs();
  console.log(openTime.toISOString(), currentTime.toISOString());
  if (currentTime.isBefore(openTime)) {
    throw new PageNotFoundError();
  }

  next();
}
module.exports = validateAccessTime;
