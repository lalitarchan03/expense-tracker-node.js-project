const express = require('express');
const router = express.Router();

const expenseControllers = require('../controllers/expense');

router.get('/get-expense', expenseControllers.getAllExpense);
router.post('/add-expense', expenseControllers.postAddExpense);
router.delete('/delete-expense/:id', expenseControllers.deleteExpense);

module.exports = router;