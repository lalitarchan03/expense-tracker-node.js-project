const express = require('express');

const router = express.Router();

const resetPasswordControllers = require('../controllers/resetPassword');

router.post('/forgotpassword', resetPasswordControllers.resetPasswordMail);
router.get('/resetpassword/:uuid', resetPasswordControllers.resetPasswordURLHandling);
router.post('/updatepassword', resetPasswordControllers.updatePassword);


module.exports = router;