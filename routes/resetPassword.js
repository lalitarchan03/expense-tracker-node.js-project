const express = require('express');

const router = express.Router();

const resetPasswordControllers = require('../controllers/resetPassword');

router.post('/forgotpassword', resetPasswordControllers.resetPasswordMail)

module.exports = router;