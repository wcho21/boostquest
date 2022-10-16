const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  req.session.destroy();
  res.clearCookie('session');
  res.redirect('/');
});

module.exports = router;
