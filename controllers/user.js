// const { where } = require('sequelize');
const User = require('../models/user');

const bcrypt = require('bcrypt');

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

        const salt = 10;
        bcrypt.hash(password, salt, async (err, hash) => {
            if(err) {
                throw new Error('Something went wrong in password encryption')
            }
            await User.create({name, email, password: hash});
            res.status(201).json({response: "User successfully created"});
        })
        
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
            bcrypt.compare(password, existingUser.password, (err, result) => {
                if(err) {
                    throw new Error('Password is wrong')
                }
                if(result) {
                    res.status(200).json({response: "User login sucessful"});
                }
                else{
                    res.status(401).json({response: "User password is wrong"});
                }
            })
        }
        else{
            res.status(404).json({response: "User not found"});
        };
        
    }
    catch(err) {
        console.log(err);
        res.status(500).json({error: err})
    }
};