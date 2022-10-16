const express = require('express');
const rootPageRenderer = require('#middlewares/root-page-renderer');
const router = express.Router();

router.get('/', rootPageRenderer);

module.exports = router;
