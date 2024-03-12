const express = require('express');
const router = express.Router();

const premiumController = require('../controllers/premiumFeatures');

const userAuthorization = require('../middleware/auth');

router.get('/showLeaderboard', userAuthorization.authenticate, premiumController.getLeaderboard);

module.exports = router;