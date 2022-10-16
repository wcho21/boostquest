const express = require('express');
const oauthHandler = require('#middlewares/oauth-handler');

const router = express.Router();
router.get('/github', oauthHandler);

module.exports = router;
