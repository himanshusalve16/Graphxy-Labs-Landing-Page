const express = require('express');
const router = express.Router();
const askRouter = require('./ask');
const waitlistRouter = require('./waitlist');

router.use('/ask', askRouter);
router.use('/waitlist', waitlistRouter);

module.exports = router;
