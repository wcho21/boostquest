module.exports = (req, res, next) => {
  if ('user' in req.session) {
    res.locals.signedIn = true;
    res.locals.user = req.session.user;
  } else {
    res.locals.signedIn = false;
  }

  next();
}
