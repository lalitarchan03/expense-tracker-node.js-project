const User = require('../models/user');
const Expense = require('../models/expense');

const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try{
        // #############    1st WAY      ####################
        // const users = await User.findAll();
        // const expenses = await Expense.findAll();
        // const leaderboardDetail = {};

        // expenses.forEach((expense) => {
        //     if(leaderboardDetail[expense.userId]) {
        //         leaderboardDetail[expense.userId] = leaderboardDetail[expense.userId] + expense.amount;
        //     }
        //     else{
        //         leaderboardDetail[expense.userId] = expense.amount;
        //     }
        // });

        // console.log(leaderboardDetail);

        // const finalLeaderboard = [];

        // users.forEach((user) => {
        //     if (user.id in leaderboardDetail) {
        //         finalLeaderboard.push({name: user.name, total_expense: leaderboardDetail[user.id]});
        //     }
        //     else{
        //         finalLeaderboard.push({name: user.name, total_expense: 0});
        //     }
        // });
        // console.log(finalLeaderboard);
        // finalLeaderboard.sort((a, b) => b.total_expense-a.total_expense);
        // console.log(finalLeaderboard);

        // ###################    2nd WAY       #########################
        // const finalLeaderboard = await User.findAll({
        //     attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_expense'] ],
        //     include: [{
        //         model: Expense,
        //         attributes: []
        //     }],
        //     group: ['user.id'],
        //     order: [['total_expense', "DESC"]]
        // });


        // #################    3rd WAY (most optimised)     #############
        const finalLeaderboard = await User.findAll({
                attributes: ['id', 'name', 'total_expense_amount' ],
                order: [['total_expense_amount', "DESC"]]
            });
    

        res.status(200).json(finalLeaderboard);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
    
}