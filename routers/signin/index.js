const express = require('express');
const config = require('#config');
const router = express.Router();

router.get('/', (req, res) => {
  // redirect directly to GitHub OAuth sign-in page
  const clientId = config.oauth.github.clientId;
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}`;

  res.redirect(redirectUrl);
});

module.exports = router;
