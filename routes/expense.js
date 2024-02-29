const express = require('express');
const router = express.Router();

const expenseControllers = require('../controllers/expense');

const userAuthorization = require('../middleware/auth');

router.get('/get-expense', userAuthorization.authenticate, expenseControllers.getAllExpense);
router.post('/add-expense', userAuthorization.authenticate, expenseControllers.postAddExpense);
router.delete('/delete-expense/:id', userAuthorization.authenticate, expenseControllers.deleteExpense);

module.exports = router;