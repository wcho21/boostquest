const express = require('express');
const config = require('#config');
const router = express.Router();

router.get('/', (req, res) => {
  const clientId = config.oauth.github.clientId;

  res.render('signin', { clientId });
});

module.exports = router;
