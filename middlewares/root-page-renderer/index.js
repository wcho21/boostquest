const problems = require('#database/problems');

module.exports = async (req, res) => {
  res.locals.problemsSolved = [false, false, false, false];
  if (res.locals.signedIn) {
    const numOfDays = 4;
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

  res.render('root');
};
