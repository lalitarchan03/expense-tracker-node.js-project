const Expense = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.postAddExpense = async (req, res , next) => {

    // console.log('backend' , req.body);

    if (!req.body.amount || !req.body.description) {
        throw new Error('Amount and Description is not mentioned');
    };

    const t = await sequelize.transaction();

    try{
        const userId = req.user.id;
        // console.log(req.user.id, "ID POST");
        const amount = req.body.amount;
        const description = req.body.description;
        const category = req.body.category

        await User.update(
            { total_expense_amount: sequelize.literal(`total_expense_amount + ${amount}`) },
            { where: { id: userId }, transaction: t },
            // {transaction: t}
        );
        console.log('Total amount updated successfully.');

        const data = await Expense.create({amount: amount, category: category, description: description, userId: userId}, {transaction: t});
        
        await t.commit()
        
        res.status(201).json({newExpenseDetail: data});
    }
    catch (err) {
        console.log(err);
        await t.rollback()
        res.status(500).json({error: err});
    }
};

exports.getAllExpense = (req, res, next) => {
    // console.log(req.user.id);
    Expense.findAll({
        where: {
            userId: req.user.id
        }
    })
        .then(data => {
            res.status(200).json({allExpenseDetail: data});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
};


exports.deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        if ( req.params.id === 'undefined') {
            console.log('id is missing');
            return res.status(400).json({error: 'id is missing'});
        }
        
        // const t = await sequelize.transaction();

        let expenseId = req.params.id;
        let expenseAmount = req.params.amount;
        let userId = req.user.id;
        // console.log(expenseAmount, "id: ", expenseId, 'userId: ', userId);

        await User.update(
            { total_expense_amount: sequelize.literal(`total_expense_amount - ${expenseAmount}`) },
            { where: { id: userId }, transaction: t }
        );
        console.log('Total amount updated successfully.');

        await Expense.destroy({
            where: {
                id: expenseId,
                userId: req.user.id,
            },
            transaction: t
        });
        console.log(`Expense with id ${expenseId} is DELETED`);
        await t.commit();
        res.sendStatus(200);
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        res.status(500).json({error: err});
    }
    
};