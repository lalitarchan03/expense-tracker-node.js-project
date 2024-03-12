const User = require('../models/user');
const Expense = require('../models/expense');

exports.getLeaderboard = async (req, res, next) => {
    try{
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const leaderboardDetail = {};

        expenses.forEach((expense) => {
            if(leaderboardDetail[expense.userId]) {
                leaderboardDetail[expense.userId] = leaderboardDetail[expense.userId] + expense.amount;
            }
            else{
                leaderboardDetail[expense.userId] = expense.amount;
            }
        });

        console.log(leaderboardDetail);

        const finalLeaderboard = [];

        users.forEach((user) => {
            if (user.id in leaderboardDetail) {
                finalLeaderboard.push({name: user.name, total_expense: leaderboardDetail[user.id]});
            }
            else{
                finalLeaderboard.push({name: user.name, total_expense: 0});
            }
        });
        console.log(finalLeaderboard);
        finalLeaderboard.sort((a, b) => b.total_expense-a.total_expense);
        console.log(finalLeaderboard);
        res.status(200).json(finalLeaderboard);
    }
    catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
    
}