// const { where } = require('sequelize');
const User = require('../models/user');

exports.postAddUser = async (req, res, next) => {
    console.log(req.body);
    try {
        const {name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({error: 'All fields are not provided'});
        }

        const existingUser = await User.findOne( {where: {
            email: email}
        });

        if (existingUser) {
            return res.status(400).json({error: 'User already exists with this email'})
        };

        const newUserDetail = await User.create({name, email, password});
        res.status(201).json({newUserDetail: newUserDetail});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err});
    };
};

exports.userLoginAuth = async (req, res, next) => {
    console.log(req.body);
    try {
        const {email, password} = req.body;

        const existingUser = await User.findOne({where: {
            email: email}
        });

        if (existingUser) {
            if (existingUser.password === password) {
                return res.status(200).json({result: "User login sucessful"});
            }
            else{
                return res.status(401).json({result: "User password is wrong"});
            }
        }
        return res.status(404).json({result: "User not found"});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err})
    }
};