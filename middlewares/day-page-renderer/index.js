const problems = require('#database/problems');

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
    const problemStatus = await problems.getStatus(userId, problemId);

    if (problemStatus.solved) {
      problemsSolved[i] = true;
    } else {
      break; // no need to loop more
    }
  }

  res.locals.firstProblemSolved = problemsSolved[0];
  res.locals.secondProblemSolved = problemsSolved[1];

  const dayNum = parseInt(day);
  if (dayNum === 4 && res.locals.firstProblemSolved && !res.locals.secondProblemSolved) {
    const firstDayProblemStatus = await problems.getStatus(userId, 12);
    const secondDayProblemStatus = await problems.getStatus(userId, 22);
    const thirdDayProblemStatus = await problems.getStatus(userId, 32);

    res.locals.firstDaySolved = firstDayProblemStatus.solved;
    res.locals.secondDaySolved = secondDayProblemStatus.solved;
    res.locals.thirdDaySolved = thirdDayProblemStatus.solved;
    res.render('day-laststep');
  } else {
    res.render('day');
  }
};
