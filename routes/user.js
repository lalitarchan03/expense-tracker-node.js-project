const express = require('express');
const router = express.Router();

const userControllers = require('../controllers/user');

router.post('/add-user', userControllers.postAddUser);
router.post('/login', userControllers.userLoginAuth);

module.exports = router;