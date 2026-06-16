const express = require('express');
const router = express.Router();
const askController = require('../controllers/askController');

router.post('/', askController.processQuestion);
router.post('/follow-up', askController.processFollowUp);

module.exports = router;
