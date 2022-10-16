const problems = require('#database/problems');
const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');

module.exports = async (req, res) => {
  if (!res.locals.signedIn) {
    throw new PageNotFoundError();
  }

  const day = parseInt(req.params.day); // assumed to be valid

  if (day !== 4) {
    throw new PageNotFoundError();
  }

  // check all previous problems are solved
  const userId = res.locals.user.id;
  const problemIds = [12, 22, 32, 41];
  const solved = await isEveryProblemSolved(problemIds, userId);
  if (!solved) {
    throw new PageNotFoundError();
  }

  await problems.updateAsSolved(userId, 42);
  res.redirect('/day/4');
}

async function isEveryProblemSolved(problemIds, userId) {
  for (const problemId of problemIds) {
    const status = await problems.getStatus(userId, problemId);

    if (!status.solved) {
      return false;
    }
  }
  
  return true;
}
