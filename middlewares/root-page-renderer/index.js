const dayjs = require('dayjs');
const config = require('#config');
const problems = require('#database/problems');

module.exports = async (req, res) => {
  const numOfDays = 4;

  res.locals.problemsSolved = [false, false, false, false];
  if (res.locals.signedIn) {
    const userId = res.locals.user.id;
    const problemIds = [12, 22, 32, 42];

    for (let i = 0; i < numOfDays; ++i) {
      const problemId = problemIds[i];

      const problemStatus = await problems.getStatus(userId, problemId);
      if (problemStatus.solved) {
        res.locals.problemsSolved[i] = true;
      }
    }
  }

  const firstDayOpenTime = dayjs(config.site.firstDayOpenTime);
  res.locals.openTimeForDay = Array(numOfDays).fill(null)
    .map((_, i) => dayjs(firstDayOpenTime).add(i, 'day').valueOf());

  res.render('root');
};
