const { PageNotFoundError } = require('#middlewares/page-not-found-error-creator');

module.exports = (err, req, res, next) => {
  if (err instanceof PageNotFoundError) {
    res.status(404);
    res.render('404');
    return;
  }

  console.error(err);
  res.sendStatus(500);
}
