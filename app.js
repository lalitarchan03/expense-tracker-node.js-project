const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

require('dotenv').config();

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense')
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumFeatures');
const resetPasswordRoutes = require('./routes/resetPassword');

const Expense = require('./models/expense');
const User = require('./models/user');
const Order = require('./models/order');
const ForgotPasswordRequests = require('./models/forgotpassword');

app.use(express.static(path.join(__dirname,"frontend")));

app.use(bodyParser.json());

// app.get('/', (req, res, next) => {
//     res.render('./frontend/login/login')
// })

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', resetPasswordRoutes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });