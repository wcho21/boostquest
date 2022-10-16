const problem = require('#database/problems');

module.exports = async (req, res) => {
  const day = req.params.day;

  res.locals.day = day;
  res.locals.firstProblemSolved = false;
  res.locals.secondProblemSolved = false;

  if (!res.locals.signedIn) {
    res.render('day');
    return;
  }

  const userId = res.locals.user.id;
  const problemsSolved = [false, false];

  for (let i = 0; i < 2; ++i) {
    const problemId = day + (i+1).toString(); // +1 due to one-based problem id
    const problemStatus = await problem.getStatus(userId, problemId);

    if (problemStatus.solved) {
      problemsSolved[i] = true;
    } else {
      break; // no need to loop more
    }
  }

  res.locals.firstProblemSolved = problemsSolved[0];
  res.locals.secondProblemSolved = problemsSolved[1];

  res.render('day');
};
