const config = require('#config');

module.exports = (req, res, next) => {
  const https = req.secure;
  if (https) {
    next();
    return;
  }

  res.location(`https://${config.server.hostname}:${config.server.httpsPort}`);
  res.status(307);
  res.end();
};
