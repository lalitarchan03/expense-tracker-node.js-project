const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense-tracker', 'root', 'myfirstproject', {dialect: 'mysql', host: 'localhost'});

module.exports = sequelize;
